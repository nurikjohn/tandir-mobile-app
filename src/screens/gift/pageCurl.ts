import { Core } from "./shaders/core"
import { frag } from "./shaders/tags"

export const pageCurl = frag`
uniform shader image;
uniform float position;
uniform vec4 container;
uniform vec2 resolution;
uniform float r;
uniform float coupon_r;
uniform float header_height;
uniform float coupon_height;
uniform float current_coupon;
uniform float coupon_distance;

const vec4 primary_color = vec4(.87, .99, .36, 1);
const vec4 background_color = vec4(0.054, 0.054, 0.054, 1);
const float backface_visibility = .2;

${Core}

bool inRect(float2 p, float4 rct) {
  bool inRct = p.x > rct.x && p.x < rct.z && p.y > rct.y && p.y < rct.w;
  if (!inRct) {
    return false;
  }

  return true;
}

vec2 topD(float2 xy, float2 center) {
  float l = (PI / 2) * r;
  float d = l - xy.y;
  float theta = asin(d / r);
  float d2 = -(l - theta * r);

  vec2 s = vec2((1.075 + sin(PI/2 + theta) * 0.075));
  mat3 transform = scale(s, center);
  vec2 uv = project(xy, transform);
  vec2 p = vec2(uv.x, d2 - position);

  return p;
}

vec4 topFG(float2 xy, vec2 p) {
  if (inRect(p, container)) {
    float4 result =  image.eval(p);
  
    return result;
  }

  return TRANSPARENT;
}

vec4 topBG(float2 xy, float2 center, bool shadow) {
  float l = (PI / 2) * r;
  float d = l - xy.y;
  float theta = asin(d / r);
  float d1 = theta * r;

  vec2 s = vec2((1. + (1.0 - sin(PI/2 + theta)) * 0.075));
  mat3 transform =scale(s, center);
  vec2 uv = project(xy, transform);
  vec2 p = vec2(uv.x, l - d1 - position);

  if (inRect(p, container)) {
    float4 result = image.eval(p);
    
    if (shadow) {
      result.rgb *= pow(clamp((r - d) / r, 0., 1.), .2);
    }
  
    return result;
  }

  return TRANSPARENT;
}

vec4 topMD(float2 xy, float2 center) {
  float l = (PI / 2) * r;
  float d = l - xy.y;
  float theta = asin(d / r);
  float d1 = theta * r;

  vec2 s = vec2((1.05 + (1.0 - sin(PI/2 + theta)) * 0.025));
  mat3 transform =scale(s, center);
  vec2 uv = project(xy, transform);
  vec2 p = vec2(uv.x, -1 * position - d1 - 3*l);

  if (inRect(p, container)) {
    float4 result = image.eval(p);
    result.rgb *= .4;
  
    return result;
  }

  return TRANSPARENT;
}

vec4 bottomFG(float2 xy, float2 center) {
  float l = (PI / 2) * r;
  float d = xy.y - l;
  float theta = asin(d / r);
  float d1 = theta * r;

  vec2 s = vec2((1.15 - (1.0 - sin(PI/2 + theta)) * 0.075));
  mat3 transform =scale(s, center);
  vec2 uv = project(xy, transform);
  vec2 p = vec2(uv.x, -1 * position - (l + d1));

  if (inRect(p, container)) {
    float4 result =  image.eval(p);
  
    return result;
  }

  return TRANSPARENT;
}

vec4 bottomBG(float2 xy, float2 center) {
  float l = (PI / 2) * r;
  float d = xy.y - l;
  float theta = asin(d / r);
  float d1 = theta * r;

  vec2 s = vec2((1.075 - (sin(PI/2 + theta)) * 0.025));
  mat3 transform =scale(s, center);
  vec2 uv = project(xy, transform);
  vec2 p = vec2(uv.x, -1 * position + d1 - 3*l);

  if (inRect(p, container)) {
    float4 result = image.eval(p);
    result.rgb *= .4;
  
    return result;
  }

  return TRANSPARENT;
}

vec4 couponCurl(float2 xy, float2 unchanged_pixel, vec4 coupon_container) {
  float4 result = TRANSPARENT;

  float2 center = vec2(resolution.x * 0.5, (coupon_container.w + coupon_container.y) * 0.5 - position);
  float dx = coupon_distance;
  float x = coupon_container.z - dx;
  float d = xy.x - x;

  if (d > coupon_r) {
    if (inRect(vec2(xy.x, xy.y - 1), coupon_container)) {
      result = background_color;
    }
  } else if (d > 0) {
    float theta = asin(d / coupon_r);
    float d1 = theta * coupon_r;
    float d2 = (PI - theta) * coupon_r;

    vec2 s = vec2((1.1 + sin(PI/2 + theta) * 0.1));
    mat3 transform = scale(s, center);
    vec2 uv = project(xy, transform);
    vec2 p2 = vec2(x + d2 / s.x, uv.y - position / s.x);

    if (p2.y + position > coupon_container.y && p2.y + position < coupon_container.w) {
      result = image.eval(p2);
    }

    if (result != TRANSPARENT) {
      result = mix(result, primary_color, 1 - backface_visibility);
      result.rgb *= pow(clamp((coupon_r - d) / coupon_r, 0., .5), .2);
    } else {      
      vec2 s = vec2((1. + (1 - sin(PI/2 + theta)) * 0.1));
      mat3 transform = scale(s, center);
      vec2 uv = project(xy, transform);
      vec2 p1 = vec2(x + d1, uv.y - position / s.x);

      if (p1.y + position > coupon_container.y && p1.y + position < coupon_container.w) {
        result = image.eval(p1);

        if (result != TRANSPARENT) {
          result.rgb *= pow(clamp((coupon_r - d) / coupon_r, 0., 1.), .2);
        } else if (inRect(xy, coupon_container)) {
          result = background_color;
        }
      }
    }
  } else { 
    vec2 s = vec2(1.2);
    mat3 transform = scale(s, center);
    vec2 uv = project(xy, transform);
    vec2 p = vec2(x + (abs(d) + PI * coupon_r) / s.x, uv.y - position / s.x);
    
    if (p.y + position > coupon_container.y && p.y + position < coupon_container.w) {
      result = image.eval(p);

      if (result != TRANSPARENT) {
        result = mix(result, primary_color, 1 - backface_visibility);
        result.rgb *= pow(clamp(1, 0., .5), .2);
      }
    }
  }

  return result;
}

vec4 main(float2 xy) {
  Context ctx = Context(image.eval(xy), xy, resolution);
  float2 center = resolution * .5;
  float l = (PI / 2) * r;

  float y = xy.y - position;
  vec2 unchanged_pixel = vec2(xy.x, y);
  vec4 scrolled_pixel = image.eval(unchanged_pixel);

  if (xy.y < l) {
    if (position >= 0 && position < l) {
      ctx.color = topBG(xy, center, true);
    } else if (position < 0) {
      float l = (PI / 2) * r;
      float d = l - xy.y;
      vec2 td = topD(xy, center);
      vec4 fg = topFG(xy, td);

      if (fg == TRANSPARENT) {
        if (position < -3 * l) {
          vec4 md = topMD(xy, center);

          if (md == TRANSPARENT) {
            ctx.color = topBG(xy, center, false);
            ctx.color.rgb *= .4;
          } else {
            ctx.color = md;
          }
        } else if (inRect(vec2(td.x, td.y- 30), container)) {
          ctx.color = topBG(xy, center, false);
            ctx.color.rgb *= .4;
        } else {
          ctx.color = topBG(xy, center, true);
        }
      } else {
        ctx.color = mix(fg, primary_color, 1 - backface_visibility);
        ctx.color.rgb *= pow(clamp((r - d) / r, 0., 1.), .2);
      }
    } else {
      ctx.color = TRANSPARENT;
    }
  } else if (xy.y < l + r) {
    if (position < -1 * l) {
      float l = (PI / 2) * r;
      float d = xy.y - l;
      vec4 fg = bottomFG(xy, center);

      if (fg == TRANSPARENT) {
        if (position > -2 * l) {
          ctx.color = scrolled_pixel;
        } else {
          vec4 bg = bottomBG(xy, center);

          if (bg == TRANSPARENT) {
            ctx.color = scrolled_pixel;
            ctx.color.rgb *= .4;
          } else {
            ctx.color = bg;
          }
        }
      } else {
        ctx.color = mix(fg, primary_color, 1 - backface_visibility);
        ctx.color.rgb *= pow(clamp((r - d) / r, 0., 1.), .2);
      }
    } else {
      ctx.color = scrolled_pixel;
    }
  }

  else {    
    ctx.color = scrolled_pixel;

    float padding = 100;
    float coupon_y = header_height + current_coupon * coupon_height + position;
    vec4 coupon_container = vec4(container.x, coupon_y, container.z, coupon_y + coupon_height);

    if (xy.y > coupon_y - padding && xy.y < coupon_y + coupon_height + padding) {
      vec4 color = couponCurl(xy, unchanged_pixel, coupon_container);
      
      if (color == TRANSPARENT) {
        ctx.color = scrolled_pixel;
      } else {
        ctx.color = color;
      }

    }
  }

  if (xy.y > l + r && -1 * position > 2 * l - r/2) {
    float d = xy.y - (l + r);

    float a = (1 - (-1 * position - (2 * l - r/4)) / (r/4)) * .2;

    ctx.color.rgb *= pow(clamp(d / r, 0., 1.), .2 - clamp(a, 0., .2));
  }

  return ctx.color;
}
`
