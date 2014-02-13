module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: true
            },
            all: [
                'lib/*.js'
            ]
        },

        node_tap: {
            default_options: {
                options: {
                    outputType: 'failures',
                    outputTo: 'console'
                },
                files: {
                    'tests': ['test/*.js']
                }
            }
        },

        uglify: {
            options: {
                banner: '// o.js : <%= pkg.version %> : http://o-js.com : MIT License\n',
            },
            build: {
                src: 'o.js',
                dest: 'o.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-node-tap');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['node_tap']);
    grunt.registerTask('minify', ['uglify']);

    grunt.registerTask('combine', 'Combine lib/*.js into a single o.js.', function() {
        var done = this.async();
        var exec = require('child_process').execFile;

        exec('bin/combine', function (err, std) {
            if (!err) {
                done( true )
            }
            else {
                grunt.log.write( std );
                done( false );
            }
        });
    });

    grunt.registerTask('default', ['lint', 'test', 'combine', 'minify']);
};
