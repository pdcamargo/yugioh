uniform sampler2D mainTexture;
uniform vec3 tint;
uniform float brightness; 

varying vec2 vUv;

void main() {
    vec4 texColor = texture2D(mainTexture, vUv);
    
    vec3 color = texColor.rgb;
    color = color * tint;
    color = color * brightness;

    gl_FragColor = vec4(color, texColor.a);
}
