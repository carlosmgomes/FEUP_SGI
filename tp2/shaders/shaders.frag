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
	float sinValue = (sin(timeFactor) + 1.0)/2.0;
	currentColor.r = currentColor.r*(1.0-sinValue) + newColor.r*sinValue;
	currentColor.g = currentColor.g*(1.0-sinValue) + newColor.g*sinValue;
	currentColor.b = currentColor.b*(1.0-sinValue) + newColor.b*sinValue;
	gl_FragColor = currentColor;

}