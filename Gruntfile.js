'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		readme_generator: {
			readme: {
				options: {
					readme_folder: "docs",
					has_travis: false,
					github_username: "ronaldtreur"
				},
				order: {
					"introduction.md": "Introduction",
					"getting-started.md": "Getting Started",
					"usage.md": "Usage",
					"options.md": "Options",
					"rules.md": "Rules",
					"examples.md": "Examples",
					"contributing.md": "Contributing"
					//"output.md": "Example Output",
					//"building-and-testing.md": "Building and Testing",
					//"legal.md": "Legal Mambo Jambo"
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-readme-generator');

	grunt.registerTask('readme', ['readme_generator']);
	grunt.registerTask('default', ['readme']);
};
