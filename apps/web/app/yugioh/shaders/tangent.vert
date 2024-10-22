varying vec3 vViewDirectionTangent;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;

varying vec2 vUv;

uniform vec4 tangent;

void main() {
    vUv = uv;

    // Get the view position in world space
    vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vec3 viewPosition = cameraPosition - worldPosition;

    // Pass the tangent, bitangent, and normal to the fragment shader
    vNormal = normalize(normalMatrix * normal);
    vTangent = normalize(normalMatrix * tangent.xyz);
    vBitangent = normalize(cross(vNormal, vTangent) * tangent.w);

    // Transform the view direction to tangent space
    mat3 TBN = mat3(vTangent, vBitangent, vNormal);
    vViewDirectionTangent = TBN * viewPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
