#pragma glslify: shiftHue = require('./modules/color.glsl')

vec3 viewDirectionColor(vec3 viewDirection, float colorDensity, vec3 color) {
  float a = colorDensity * viewDirection.x;

  float b = a * viewDirection.y;

  return shiftHue(color, b);
}

#pragma glslify: export(viewDirectionColor)
