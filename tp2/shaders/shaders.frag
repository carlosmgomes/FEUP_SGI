#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float timeFactor;

uniform vec3 newColor;


void main() {
	vec4 currentColor = texture2D(uSampler, vTextureCoord);
	vec4 newColor = vec4(newColor, 1.0);
	if (sin(timeFactor) > -0.5) {
		gl_FragColor = newColor;
	}
	else {
		gl_FragColor = currentColor;
	}	

}