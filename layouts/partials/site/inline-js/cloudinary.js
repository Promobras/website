/* global cloudinary */
var myBreakpoints = [
  200,
  400,
  800,
  1080,
  1600,
  1920,
  3840,
  5760
]
var cl = cloudinary.Cloudinary.new({cloud_name: '{{ $.Site.Params.cloudinary }}'})
cl.config({breakpoints: myBreakpoints, responsive_use_breakpoints: true})
cl.responsive()
