#!/usr/bin/env perl
use strict;
use warnings;

use LWP::UserAgent;

my $ua = LWP::UserAgent->new();

my ($file) = @ARGV;
open( my $fh, '<', $file );
my $js = do { local $/ = <$fh> };

#$ua->default_header( 'Content-type' => 'application/x-www-form-urlencoded' );

my $res = $ua->post(
    'http://closure-compiler.appspot.com/compile',
    {
        js_code => $js,
        compilation_level => 'SIMPLE_OPTIMIZATIONS',
        output_format => 'text',
        output_info => 'compiled_code',
#        output_info => 'warnings',
#        output_info => 'errors',
#        output_info => 'statistics',
    },
);

print $res->decoded_content();

__END__

<html>
  <body>
    <form action="http://closure-compiler.appspot.com/compile" method="POST">
    <p>Type JavaScript code to optimize here:</p>
    <textarea name="js_code" cols="50" rows="5">
    function hello(name) {
      // Greets the user
      alert('Hello, ' + name);
    }
    hello('New user');
    </textarea>
    <input type="hidden" name="compilation_level" value="WHITESPACE_ONLY">
    <input type="hidden" name="output_format" value="text">
    <input type="hidden" name="output_info" value="compiled_code">
    <br><br>
    <input type="submit" value="Optimize">
    </form>
  </body>
</html>
