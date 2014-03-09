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
                banner: '// o.js : DEVELOPMENT VERSION : http://o-js.com : MIT License\n',
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

    // An exec wrapper that throws an error on error.
    var nativeExec = require('child_process').exec;
    var exec = function (command, cb) {
        grunt.log.writeln('Running: ' + command);

        nativeExec(command, function (error, stdout, stderr) {
            if (error === null) {
                cb( stdout );
            }
            else {
                grunt.log.write( stderr );
                throw new Error('Error running: ' + command);
            }
        });
    };

    grunt.registerTask(
        'combine',
        'Combine lib/*.js into a single o.js.',
        function() { exec('bin/combine', this.async()); }
    );

    grunt.registerTask(
        'tag',
        'Determine next version, modify files to reference it, and commit the tag.',
        function(next) { exec('bin/tag --no-prompt --next=' + next, this.async()); }
    );

    grunt.registerTask('default', ['lint', 'test', 'combine', 'minify']);

    grunt.registerTask('release-major', ['default', 'tag:major']);
    grunt.registerTask('release-minor', ['default', 'tag:minor']);
    grunt.registerTask('release-patch', ['default', 'tag:patch']);

    /// grunt.registerTask('publish', ['publish-npm', 'publish-jam', 'publish-bower']);
};
