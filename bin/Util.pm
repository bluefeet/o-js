package Util;
use strict;
use warnings;
use autodie;

use FindBin qw( $Bin );
use IPC::Cmd qw();

my $version_re = qr{^(\d+)\.(\d+)\.(\d+)$};
my $tag_re = qr{^v(\d+)\.(\d+)\.(\d+)$};

sub new {
    my $class = shift;
    my $self = bless { @_ }, $class;

    $self->{repo_dir} ||= "$Bin/..";
    die "ERROR: $self->{repo_dir} does not look like a git clone.\n"
        if !-d "$self->{repo_dir}/.git";

    return $self;
}

sub repo_dir {
    my ($self) = @_;
    return $self->{repo_dir};
}

sub run {
    my $self = shift;

    my ($success, $error, $full, $stdout, $stderr) = IPC::Cmd::run( command => [@_] );
    return join('', @$stdout) if $success;

    die sprintf(
        "ERROR: %s\n%s",
        $error,
        join('', @$stderr),
    );
}

sub git_run {
    my $self = shift;

    my $repo_dir = $self->repo_dir();

    return $self->run(
        'git',
        '--work-tree=' . $repo_dir,
        '--git-dir=' . $repo_dir . '/.git',
        @_,
    );
}

sub current_version {
    my ($self) = @_;

    $self->git_run('fetch');
    my $tags_string = $self->git_run('tag');

    my ($major, $minor, $patch) = (0, 0, 0);

    my @tags = split(/\s+/, $tags_string);
    foreach my $tag (@tags) {
        if ($tag =~ $tag_re) {
            my ($tag_major, $tag_minor, $tag_patch) = ($1+0, $2+0, $3+0);
            next if $tag_major < $major;
            next if $tag_major == $major and $tag_minor < $minor;
            next if $tag_major == $major and $tag_minor == $minor and $tag_patch < $patch;
            ($major, $minor, $patch) = ($tag_major, $tag_minor, $tag_patch);
        }
    }
    die "ERROR: No version tags found.\n" unless $major or $minor or $patch;

    return "$major.$minor.$patch";
}

sub next_version {
    my ($self, $version, $next) = @_;

    die "ERROR: Version must be in the N.N.N (semver) format.\n"
        unless $version and $version =~ $version_re;

    die "ERROR: The next argument must be one of patch, minor, or major.\n"
        unless $next and $next =~ m{^(?:patch|minor|major)$}s;

    my ($major, $minor, $patch) = ($version =~ $version_re);

    if ($next eq 'major') {
        $major++;
        $minor = 0;
        $patch = 0;
    }
    elsif ($next eq 'minor') {
        $minor++;
        $patch = 0;
    }
    else {
        $patch++;
    }

    return "$major.$minor.$patch";
}

sub stamp {
    my ($self) = @_;
    my ($year, $month, $day) = ( localtime(time) )[5, 4, 3];
    return sprintf('%04d-%02d-%02d', $year+1900, $month+1, $day);
}

sub is_git_dirty {
    my ($self) = @_;
    my $status = $self->git_run('status', '-s');
    return ($status =~ m{\S}) ? 1 : 0;
}

sub slurp {
    my ($self, $file) = @_;
    $file = $self->repo_dir() . "/$file";
    print "Reading $file.\n";
    open(my $fh, '<', $file);
    my $content = do { local $/; <$fh> };
    return $content;
}

sub spew {
    my ($self, $file, $content) = @_;
    $file = $self->repo_dir() . "/$file";
    print "Writing $file.\n";
    open(my $fh, '>', $file);
    print $fh $content;
}

sub ask_yn {
    my ($self, $question, $default) = @_;
    my $answer = $self->ask( $question, $default );
    return 1 if $answer eq 'y';
    return 0;
}

sub ask {
    my ($self, $question, $default) = @_;
    print "$question: ";
    my $answer = <STDIN>;
    chomp( $answer );
    $answer ||= $default || '';
    return $answer;
}

1;
