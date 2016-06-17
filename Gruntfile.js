
module.exports = function(grunt) {

  grunt.initConfig({
    copy: {
      test: {
        expand: true,
        cwd: './node_modules/barrels/test/',
        src: '**',
        dest: './test/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['copy']);
  
};
