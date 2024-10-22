#pragma glslify: viewDirectionColor = require('./view-direction.glsl')

#ifdef GL_ES
precision mediump float;
#endif

// TODO: figure out a batter way of injecting global uniforms
uniform float TIME;

uniform vec3 lightBaseDirection;
uniform float lightMoveAmplitude;
uniform float lightSpeed;

varying vec3 vViewDirectionTangent;
varying vec2 vUv;
varying vec3 vNormal;

uniform float colorDensity;
uniform vec2 tiling;
uniform float brightPower;
uniform float foilScale;
uniform sampler2D foilPattern;
uniform sampler2D colorPatternTexture;

uniform sampler2D mainTexture;
uniform sampler2D maskTexture;

const float minimumGradient = 0.1;
const float maximumGradient = 1.0;

// Noise function to create non-uniform gradient influences
float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float smoothGradient(vec2 uv, vec2 center, float scale) {
    float radius = 0.25 * scale; // Adjusted radius for smoother transitions
    return smoothstep(radius + 0.1, radius - 0.1, distance(uv, center));
}

float pointGradient(vec2 uv, vec2 center, float influenceRadius) {
    return smoothstep(influenceRadius + 0.05, influenceRadius, distance(uv, center));
}

vec3 getRainbowColor(float t) {
    // Simple rainbow effect using sine waves
    float red   = 0.5 + 0.5 * sin(6.28318 * (t + 0.0 / 3.0));
    float green = 0.5 + 0.5 * sin(6.28318 * (t + 1.0 / 3.0));
    float blue  = 0.5 + 0.5 * sin(6.28318 * (t + 2.0 / 3.0));
    return vec3(red, green, blue);
}

float getGrayscale(float t) {
    // Generate a grayscale value between 0.0 and 1.0 using sine waves
    return 0.5 + 0.5 * sin(6.28318 * t); // You can modify the frequency if needed
}

#pragma glslify: bilinearGradient = require('./modules/gradients/bilinear-gradient.glsl')

vec3 interpolateColors(vec3 color1, vec3 color2, float factor) {
    return mix(color1, color2, factor);
}

void main() {

    float lightIntensity = max(dot(vNormal, normalize(lightBaseDirection)), 0.0);

    vec2 scaledUv = vUv * foilScale * tiling;
    vec4 foilColor = texture2D(foilPattern, scaledUv);
    vec4 colorPattern = texture2D(colorPatternTexture, scaledUv);

    // Oscillation factor for color transitions
    float oscillationFactor = (sin(TIME * lightSpeed) * lightMoveAmplitude) + lightMoveAmplitude;
    float verticalOscillation = (cos(TIME * lightSpeed) * lightMoveAmplitude) + lightMoveAmplitude;

    // Define static corner colors
    vec3 topLeft = vec3(1.0);
    vec3 topRight = vec3(0.0);
    vec3 bottomLeft = vec3(0.2);
    vec3 bottomRight = vec3(0.0);

    // Interpolate horizontal transitions
    vec3 currentTopLeft = interpolateColors(topLeft, topRight, oscillationFactor);
    vec3 currentTopRight = interpolateColors(topRight, topLeft, oscillationFactor);
    vec3 currentBottomLeft = interpolateColors(bottomLeft, bottomRight, oscillationFactor);
    vec3 currentBottomRight = interpolateColors(bottomRight, bottomLeft, oscillationFactor);

    // Interpolate vertical transitions using the same factor for simplicity or different for complexity
    vec3 finalTopLeft = interpolateColors(currentTopLeft, currentBottomRight, verticalOscillation);
    vec3 finalTopRight = interpolateColors(currentTopRight, currentBottomLeft, verticalOscillation);
    vec3 finalBottomLeft = interpolateColors(currentBottomLeft, currentTopRight, verticalOscillation);
    vec3 finalBottomRight = interpolateColors(currentBottomRight, currentTopLeft, verticalOscillation);

    vec3 blColor = bilinearGradient(vUv, finalTopLeft, finalTopRight, finalBottomLeft, finalBottomRight);
    // vec3 checkerboardGradient(vec2 uv, vec3 color1, vec3 color2, float size) {
    // vec3 blColor = checkerboardGradient(vUv, vec3(0.15), vec3(1), 10.5);

    float modifiedColorDensity = max(colorDensity, 1.1);
    float modifiedBrightPower = max(brightPower, 1.1);

    float t = vUv.x;
    vec3 rainbowColor = viewDirectionColor(vViewDirectionTangent, modifiedColorDensity, getRainbowColor(t));

    vec3 modifiedFoilColor = (foilColor.rgb * rainbowColor * colorPattern.rgb) * modifiedBrightPower;
  
    float visibility = smoothstep(0.3, 0.7, length(blColor.rgb));

    // vec4 combinedFoil = foilColor * colorPattern * lightIntensity * colorDensity * visibility;

    vec4 baseColor = texture2D(mainTexture, vUv);
    vec4 mask = texture2D(maskTexture, vUv);
    float maskedArea = step(0.05, length(mask.rgb));

    vec4 combinedFoil = vec4(modifiedFoilColor * lightIntensity * colorDensity * visibility, 1.0);

    vec4 finalColor = mix(baseColor, baseColor + combinedFoil, maskedArea);

    gl_FragColor = finalColor;
}