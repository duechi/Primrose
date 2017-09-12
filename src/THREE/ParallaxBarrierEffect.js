/**
 * @author mrdoob / http://mrdoob.com/
 * @author marklundin / http://mark-lundin.com/
 * @author alteredq / http://alteredqualia.com/
 */

import { OrthographicCamera, Scene, StereoCamera,
  LinearFilter, NearestFilter, RGBAFormat,
  WebGLRenderTarget, ShaderMaterial, Mesh,
  PlaneBufferGeometry } from "three";

export class ParallaxBarrierEffect {
  constructor( renderer ) {
    var _camera = new OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

    var _scene = new Scene();

    var _stereo = new StereoCamera();
    var _params = { minFilter: LinearFilter, magFilter: NearestFilter, format: RGBAFormat };

    var s = 2048;
    var _renderTargetL = new WebGLRenderTarget( s, s, _params );
    var _renderTargetR = new WebGLRenderTarget( s, s, _params );

    var linesPerInch = 50;
    var inches = 4.4375;
    var lines = linesPerInch * inches;
    var pixels = 2560;
    var pixelsPerLine = pixels / lines;

    var self = this;
    window.delta = 5;

    Object.defineProperties(window, {
      up: {
        get() {
          linesPerInch += window.delta;
          self.setStripe(linesPerInch);
          return linesPerInch;
        }
      },
      down: {
        get() {
          linesPerInch -= window.delta;
          self.setStripe(linesPerInch);
          return linesPerInch;
        }
      }
    });

    this.setStripe = function(i) {

    };

    this.makeMaterial = function(i) {

      return new ShaderMaterial( {
        uniforms: {
          "mapLeft": { value: _renderTargetL.texture },
          "mapRight": { value: _renderTargetR.texture },
          "pixelsPerLine": { value: i },
          "invPixelsPerLine": { value: 1 / i },
          "midpoint": { value: i / 2 },
          "imageWidth": { value: pixels },
          "invImageWidth": { value: 1 / pixels }
        },

        vertexShader:
`varying vec2 vUv;
void main() {
 vUv = vec2( uv.x, uv.y );
 gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,

      fragmentShader:
`uniform sampler2D mapLeft;
uniform sampler2D mapRight;
uniform float invPixelsPerLine;
uniform float pixelsPerLine;
uniform float midpoint;
uniform float imageWidth;
uniform float invImageWidth;

varying vec2 vUv;

void main() {
 float stripe = floor( gl_FragCoord.x * invPixelsPerLine );
 float stripeX = stripe * pixelsPerLine;
 float dx = pixelsPerLine - mod( gl_FragCoord.x, pixelsPerLine );
 float x = stripeX + dx;

 vec2 uv = vec2((2.0 * x - 0.5 * imageWidth) * invImageWidth, vUv.y);
 if(uv.x < 0.0 || uv.x >= 1.0 ) {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
 }
 else if ( dx > midpoint ) {
   gl_FragColor = texture2D( mapLeft, uv );
 } else {
   gl_FragColor = texture2D( mapRight, uv );
 }
}`

      } );
    };

    this._material = this.makeMaterial(pixelsPerLine);

    var mesh = new Mesh( new PlaneBufferGeometry( 2, 2 ), this._material );

    _scene.add( mesh );

    this.setSize = function ( width, height ) {

      renderer.setSize( width, height );

      var pixelRatio = renderer.getPixelRatio();

      _renderTargetL.setSize( width * pixelRatio, height * pixelRatio );
      _renderTargetR.setSize( width * pixelRatio, height * pixelRatio );

    };

    this.render = function ( scene, camera ) {

      scene.updateMatrixWorld();

      if ( camera.parent === null ) camera.updateMatrixWorld();

      _stereo.update( camera );

      renderer.render( scene, _stereo.cameraL, _renderTargetL, true );
      renderer.render( scene, _stereo.cameraR, _renderTargetR, true );
      renderer.render( _scene, _camera );

    };

  }
}
