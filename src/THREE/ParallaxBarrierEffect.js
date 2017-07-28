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

    var n = 2;
    var self = this;
    window.delta = 0.01;

    Object.defineProperties(window, {
      up: {
        get() {
          n += window.delta;
          self.setStripe(n);
          return n;
        }
      },
      down: {
        get() {
          n -= window.delta;
          self.setStripe(n);
          return n;
        }
      }
    });

    this.makeMaterial = function(i) {

      var n = i.toString(),
        m = (i / 2).toString();

      if(n.indexOf(".") === -1) {
        n += ".0";
      }

      if(m.indexOf(".") === -1) {
        m += ".0";
      }

      return new ShaderMaterial( {
        uniforms: {
          "mapLeft": { value: _renderTargetL.texture },
          "mapRight": { value: _renderTargetR.texture }
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
varying vec2 vUv;
void main() {
 vec2 uv = vUv;
 if ( ( mod( gl_FragCoord.x, ${n} ) ) > ${m} ) {
   gl_FragColor = texture2D( mapLeft, uv );
 } else {
   gl_FragColor = texture2D( mapRight, uv );
 }
}`

      } );
    };

    var _material = this.makeMaterial(n);

    var mesh = new Mesh( new PlaneBufferGeometry( 2, 2 ), _material );

    this.setStripe = function(n) {
      _material = this.makeMaterial(n);
      mesh.material = _material;
    };


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
