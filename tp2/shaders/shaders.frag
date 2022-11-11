#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float timeFactor;

uniform vec3 originalColor;
uniform vec3 newColor;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);

    color = vec4(color.r + newColor.r * sin(timeFactor), color.g + newColor.g * sin(timeFactor), color.b + newColor.b * sin(timeFactor), 1.0);

    gl_FragColor = color;
}