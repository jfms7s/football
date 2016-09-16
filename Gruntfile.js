
module.exports = function(grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var globby = require('globby');
    var vendorDeps = (require('wiredep')({dependencies: true,devDependencies: true}));

    vendorDeps.js   = (vendorDeps.js  ||[]).map(refactorPaths);
    vendorDeps.css  = (vendorDeps.css ||[]).map(refactorPaths);
    vendorDeps.less = (vendorDeps.less||[]).map(refactorPaths);

    var appFiles = globby.sync(["src/app/**/*.js","!src/app/**/*.spec.js"],{nosort:true});

    function refactorPaths(ele) {
        return ele.replace(/.*\\src(\\.*?\\)?/,"");
    }

    // Project configuration.

    grunt.registerTask('dev',[
        'htmlhint',
        'jshint',//Verify html and js files for errors

        'wiredep',
        'includeSource:build',
        'connect',
        'watch'
    ]);

    grunt.registerTask('build',[
        'clean',
        'mkdir',
        'concat',
        'babel',
        'ngAnnotate',

        'copy:vendor',
        'copy:build',

        'uglify',

        'wiredep',
        'copy:dist',
        'includeSource:dist',
    ]);


    grunt.registerTask('default', []);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            build: {
                files: [{
                    dot: true,
                    src: ['.tmp','dist/{,*/}*','!dist/.git*']
                }]
            }
        },
        mkdir:{
            build:{
                options:{
                    create:['.tmp', 'dist']
                }
            }
        },
        concat : {
            angular : {
                options: {
                    sourceMap: true,
                    banner  : "'use strict';\n",// Replace all 'use strict' statements in the code with a single one at the top
                    process : function (src, filepath) {
                        return '// Source: ' + filepath + '\n' + src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    }
                },
                files:[
                    {
                        src     : appFiles,
                        dest    : ".tmp/appValidoo/app.js"
                    }
                ]
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    '.tmp/appValidoo/app.js': '.tmp/appValidoo/app.js'
                }
            }
        },
        ngAnnotate: {
            build:{
                files:{
                    '.tmp/assets/js/app.js' : ".tmp/appValidoo/app.js"
                }
            }
        },
        uglify: {
            angular: {
                options: {
                    sourceMapIncludeSources: true,
                    sourceMap: true
                },
                expand  : true,
                cwd     : ".tmp",
                src     : ["assets/**/*.js", "!assets/**/*.min.js"],
                dest    : ".tmp",
                ext     : '.min.js'
            }
        },
        //END COMPLILE BUILD -> DIST
        //Min css in temp '*.css', '!*.min.css' -> 'min.css'
        //Move files
        copy: {
            vendor:{
                files:[
                    {
                        expand  : true,
                        cwd     : "src/bower_components/",
                        src     : vendorDeps.css,
                        dest    : ".tmp/bower_components/"
                    },
                    {
                        expand  : true,
                        cwd     : "src/bower_components/",
                        src     : vendorDeps.js,
                        dest    : ".tmp/bower_components/"
                    },
                    {
                        expand  : true,
                        cwd     : "src/bower_components/",
                        src     : ["**/*.eot","**/*.svg","**/*.ttf","**/*.woff","**/*.woff2"],
                        dest    : ".tmp/bower_components/"
                    }
                ]
            },
            build:{
                files:[
                    {
                        expand: true,
                        cwd : "src/assets/css/",
                        src : "**/*.css",
                        dest: ".tmp/assets/css/"
                    },
                    {
                        expand: true,
                        cwd : "src/assets/js/",
                        src : "**/*.js",
                        dest: ".tmp/assets/js/"
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: "src/assets/img/",
                        src: "**/*",
                        dest: ".tmp/assets/img/"
                    },
                    {
                        expand: true,
                        cwd: "src/assets/fonts/",
                        src: "**/*",
                        dest:".tmp/assets/fonts/"
                    },
                    {
                        expand: true,
                        cwd: "src/",
                        src: "**/*.html",
                        dest: ".tmp/"
                    }
                ]
            },
            dist:{
                files:[
                    {
                        expand  : true,
                        cwd     : ".tmp/bower_components/",
                        src     : "**/*",
                        dest    : "dist/bower_components/"
                    },
                    {
                        expand: true,
                        cwd : ".tmp/assets/css/",
                        src : "**/*",
                        dest: "dist/assets/css/"
                    },
                    {
                        expand: true,
                        cwd : ".tmp/assets/js/",
                        src : ["**/*.min.js","**/*.map"],
                        dest: "dist/assets/js/"
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: ".tmp/assets/img/",
                        src: "**/*",
                        dest: "dist/assets/img/"
                    },
                    {
                        expand: true,
                        cwd: ".tmp/assets/fonts/",
                        src: "**/*",
                        dest:"dist/assets/fonts/"
                    },
                    {
                        expand: true,
                        cwd: ".tmp/",
                        src: "**/*.html",
                        dest: "dist/"
                    }
                ]
            }
        },

        // INJECT FILES INTO MAIN
        includeSource: {
            build: {
                options :{
                    basePath:"src"
                },
                files: {
                    'src/index.html'        : 'src/index.html'
                }
            },
            temp: {
                options :{
                    basePath:".tmp"
                },
                files: {
                    '.tmp/index.html'        : 'src/index.html'
                }
            },
            dist: {
                options :{
                    basePath:"dist"
                },
                files: {
                    'dist/index.html'        : 'src/index.html'
                }
            }
        },
        wiredep: {
            dist:{
                src: "src/index.html",
                options: {
                    dependencies: true,
                    devDependencies: false
                }
            },
            build: {
                exclude:[/(jasmine)/],
                src: "src/index.html",
                options: {
                    dependencies: true,
                    devDependencies: true
                }
            }
        },

        //CHECK for errors
        jshint: {
            options: {
                jshintrc:true,
                reporter: require('jshint-stylish'),
                force:true
            },
            gruntfile: ['Gruntfile.js'],
            apps : [
                "src/app/**/*.js",
                "src/assets/**/*.js"
            ]
        },
        htmlhint: {
            index:{
                options: {
                    "htmlhintrc": '.htmlhintrc',
                    "doctype-first": true,
                    "doctype-html5": true,
                    "title-require": true,
                    "style-disabled":true,
                    "force":true
                },
                src: "src/index.html"
            },
            views: {
                options: {
                    "htmlhintrc": '.htmlhintrc',
                    "force":true
                },
                src : ["src/app/**/*.html"]
            }
        },

        connect: {
            localServer: {
                options: {
                    port: 3000,
                    base: "src"
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            html: {
                files: [
                    "src/app/**/*.html"
                ],
                tasks: ['newer:htmlhint'],
                options: {
                    spawn: false
                }
            },
            styles: {
                files: [
                    "src/assets/**/*.css"
                ],
                tasks: ['includeSource'],
                options: {
                    spawn: false
                }
            },
            js: {
                files: ["src/app/**/*.js"],
                tasks: ['includeSource'],
                options: {
                    spawn: false
                }
            },
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['jshint:gruntfile'],
                options: {
                    spawn: false
                }
            }
        }
    });
};