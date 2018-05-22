---
title: CentOS监控ssh免密登录
image: https://res.cloudinary.com/fengerzh/image/upload/ssh_xbpzoi.jpg
category: 运维
tags:
- ssh
- centos
description: ssh免密登录在带来方便的同时也带来一些问题，那就是不知道什么时间什么人利用ssh免密通道登录服务器了.
color: black
---

`ssh`免密登录在带来方便的同时也带来一些问题，那就是不知道什么时间什么人利用`ssh`免密通道登录服务器了，为此我们需要在`sshd`的配置文件里设置好详细日志，以便日后回溯。

在`CentOS`里，`sshd`的日志文件是保存在`/var/log/secure`里的，如果不进行特殊设置的话，它只记录一些最简单的信息，比如什么时间哪个账号被人用免密登录的方式登录了，如果这个账号的`authorized_keys`里有很多`key`的话，这样的`log`没有办法告诉你客户到底是用哪个`key`登录的。

所以，我们需要在`sshd`的配置文件`/etc/ssh/sshd_config`文件里找到以下项`LogLevel`并把它改成`LogLevel VERBOSE`，这一项的缺省值是`INFO`，不够详细，所以我们需要把它改成啰嗦模式，这样可以记录更多信息。

改成`VERBOSE`并重启`sshd`(`service sshd restart`)后，我们会在日志文件里看到类似于这样的记录：

```
Apr  1 10:37:06 hostname sshd[5903]: Found matching RSA key: 83:67:b5:c7:bb:17:4d:06:ca:dc:8b:ca:85:cc:0c:b1
```

但这样的信息明显不同于我们在`authorized_keys`里存放的信息，那该怎么办呢？实际上，在`sshd`的日志文件里存储的只是我们`authorized_keys`的指纹信息`fingerprint`，不是真正的`key`，必须从`authorized_keys`反算出`fingerprint`来，才能做对比：

```
ssh-keygen -E md5 -lf /home/someuser/.ssh/authorized_keys
```

但是这样依然很麻烦，有没有办法直接告诉我日志里到底是谁登录的呢？为此我们还需要引入一个[用 Perl 写的小程序][1]。(原作者写的略有问题，在新版的`CentOS`里必须要求附加`md5`参数，为此我做了一些小的修改)：

```perl
#!/usr/bin/perl -w
use strict;
use diagnostics;
use File::Temp;

# Matches Fingerprints from sshd logs (sshd on loglevel VERBOSE) against
# authorized_keys for the respective user.

die "Please specify input file!\n" unless ($ARGV[0]);

my $fingerprints;

my $nav = File::Navigate->new($ARGV[0]);
# Store publickey login events
my @lines = @{$nav->find(qr/sshd\[\d+\]: Accepted publickey for .+ from .+ port \d+/)};

# Process all publickey login events
foreach(@lines){
	$nav->cursor($_);
	my $line = $nav->get();
	$line =~ /^(.{15}).+sshd\[(\d+)\]: Accepted publickey for (.+) from (.+) port (\d+)/;
	my $date = $1;
	my $pid  = $2;
	my $user = $3;
	my $ip   = $4;
	my $port = $5;
	my $fp   = "unknown"; # (yet)
	# Seek backwards to find matching fingerprint line
	my $sought = 0;
	while ((my $seekline = $nav->getprev()) and ($sought++ < 1000)){
		if ($seekline =~ /sshd\[$pid\]: Found matching .+ key: (.+)/){
			$fp = $1;
			last;
		}elsif($line =~ /sshd\[$pid\]: Connection from $ip port $port/){
			last;
		}
	}
	my $key = get_key($fp, $user);
	print "\"$date\";\"$user\";\"$fp\";\"$key\"\n";
}

sub get_key{
	my $fp   = shift;
	$fp = "MD5:" . $fp;
	my $user = shift;

	# See if FP is cached
	if ($fingerprints->{$user}){
		if ($fingerprints->{$user}->{$fp}){
			return $fingerprints->{$user}->{$fp};
		}else{
			return "No matching key found.";
		}
	}

	# Else, generate fingerprints from users authorized_keys
	print STDERR "------> Reading keys for user $user\n";
	my $home = (getpwnam($user))[7];
	open my $fh_in, "<$home/.ssh/authorized_keys" or warn "No such file: $home/.ssh/authorized_keys\n";
	while (<$fh_in>){
		chomp;
		next unless (/^ssh-/);
		my $out_fh = File::Temp->new();
		print $out_fh "$_\n";
		close $out_fh;
		my $fp_raw = `ssh-keygen -E md5 -lf $out_fh`;
		# Second field of output has the fingerpring
		my $fp = (split /\s+/, $fp_raw)[1];
		$fingerprints->{$user}->{$fp} = $_;
	}
	if ($fingerprints->{$user}->{$fp}){
		return $fingerprints->{$user}->{$fp};
	}else{
		return "No matching key found.";
	}
}

package File::Navigate;
use strict;
use warnings;

=head1 NAME

File::Navigate - Navigate freely inside a text file

=head1 DESCRIPTION

The module is a glorified wrapper for tell() and seek().

It aims to simplify the creation of logfile analysis tools by
providing a facility to jump around freely inside the contents
of large files without creating the need to slurp excessive
amounts of data.

=head1 SYNOPSIS

  use File::Navigate;
  my $nav = File::Navigate->new('/var/log/messages');

  # Read what's below the "cursor":
  my $first = $nav->get;

  # Advance the cursor before reading:
  my $second = $nav->getnext;
  my $third  = $nav->getnext;

  # Advance the cursor by hand:
  $nav->next;
  my $fourth = $nav->get;

  # Position the cursor onto an arbitrary line:
  $nav->cursor(10);
  my $tenth  = $nav->get;

  # Reverse the cursor one line backward:
  $nav->prev;
  my $ninth  = $nav->get;

  # Reverse the cursor before reading:
  my $eigth  = $nav->getprev;

  # Read an arbitrary line:
  my $sixth  = $nav->get(6);

=cut

our @ISA       = qw(Exporter);
our @EXPORT_OK = qw();
our $VERSION   = '1.0';

=head1 CLASS METHODS

=head2 I<new()>

Open the file and create an index of the lines inside of it.

  my $mapper = File::Navigate->new($filename);

=cut

sub new($){
	my $class = shift;
	my $file;
	unless ($file = shift){
		die "No file specified\n";
	}
	unless (-e $file){
		die "File not found: $file\n";
	}
	unless (-r $file){
		die "File not readable: $file\n";
	}
	my $self = {};
	   $self->{'cursor'}         = 1;
	   $self->{'lineindex'}      = {};
	   $self->{'lineindex'}->{1} = 0;
	open my $fh, "$file"
		or die "Can't open $file: $!\n";
	while (<$fh>){
		my $thisline = $.;
		my $nextline = $thisline + 1;
		$self->{'lineindex'}->{$nextline} = tell $fh;
	}
	$self->{'length'} = scalar(keys %{$self->{'lineindex'}}) - 1 ;
	$self->{'fh'} = $fh;
	bless $self;
}

=head1 OBJECT METHODS

=head2 I<count()>

Returns the number of lines in the file ("wc -l")

  my $lines = $nav->count;

=cut

sub length(){
	my $self = shift;
	return $self->{'length'};
}

=head2 I<cursor()>

Returns the current cursor position and/or sets the cursor.

  my $cursor = $nav->cursor();   # Query cursor position.
  my $cursor = $nav->cursor(10); # Set cursor to line 10

=cut

sub cursor($){
	my $self = shift;
	if (my $goto = shift){
		$self->{'cursor'} = $goto;
	}
	return $self->{'cursor'};
}

=head2 I<get()>

Gets the line at the cursor position or at the given position.

  my $line = $nav->get();   # Get line at cursor
  my $line = $nav->get(10); # Get line 10

=cut

sub get($){
	my $self = shift;
	my $fh   = $self->{'fh'};

	my $getline;
	$getline = $self->{'cursor'} unless ($getline = shift);

	if ($getline < 1){
		warn "WARNING: Seek before first line.";
		return undef;
	}elsif($getline > $self->{'length'}){
		warn "WARNING: Seek beyond last line.";
		return undef;
	}
	seek ($fh, $self->{'lineindex'}->{$getline}, 0);
	my $gotline = <$fh>;
	chomp $gotline;
	return $gotline;
}

=head2 I<next()>

Advance the cursor position by one line. Returns the new cursor position.
Returns I<undef> if the cursor is already on the last line.

  my $newcursor = $nav->next();

=cut

sub next(){
	my $self = shift;
	if ($self->{'cursor'} == $self->{'length'}){
		return undef;
	}
	$self->{'cursor'}++;
	return $self->{'cursor'};
}

=head2 I<prev()>

Reverse the cursor position by one line. Returns the new cursor position.
Returns I<undef> if the cursor is already on line 1.

  my $newcursor = $nav->prev();

=cut

sub prev(){
	my $self = shift;
	if ($self->{'cursor'} == 1){
		return undef;
	}
	$self->{'cursor'}--;
	return $self->{'cursor'};
}

=head2 I<getnext()>

Advance to the next line and return it.
Returns I<undef> if the cursor is already on the last line.

  my $newcursor = $nav->getnext();

=cut

sub getnext(){
	my $self = shift;
	$self->next or return undef;
	return $self->get;
}

=head2 I<getprev()>

Reverse to the previous line and return it:
Returns I<undef> if the cursor is already on line 1.

  my $newcursor = $nav->getprev();

=cut

sub getprev(){
	my $self = shift;
	$self->prev or return undef;
	return $self->get;
}

=head2 I<find()>

Find lines containing given regex. Returns array with line numbers.

  my @lines = @{$nav->find(qr/foo/)};

=cut

sub find($){
	my $self = shift;
	my $regex = shift;

	my @results;
	for (my $lineno = 1; $lineno <= $self->{'length'}; $lineno++){
		my $line = $self->get($lineno);
			if ($line =~ $regex){
			push @results, $lineno;
		}
	}
	return \@results;
}

sub DESTROY(){
	my $self = shift;
	close $self->{'fh'};
}

=head1 EXAMPLE

I<tac>, the opposite of I<cat>, in Perl using File::Navigate:

  #!/usr/bin/perl -w
  use strict;
  use File::Navigate;

  foreach my $file (reverse(@ARGV)){
          my $nav = File::Navigate->new($file);
          # Force cursor beyond last line
          $nav->cursor($nav->length()+1);
          print $nav->get()."\n" while $nav->prev();
  }

=head1 BUGS

Seems to lack proper error handling.

=head1 LIMITATIONS

Works only on plain text files. Sockets, STDIO etc. are not supported.

=head1 PREREQUISITES

Tested on Perl 5.6.1.

=head1 STATUS

Mostly harmless.

=head1 AUTHOR

Martin Schmitt <mas at scsy dot de>

=cut

1;
```

为此我们给它起名叫`match-ssh-keys`，赋予它可执行权限(`chmod +x match-ssh-keys`)，然后把它搬到`/usr/local/bin`里(`mv match-ssh-keys /usr/local/bin/`)，这样我们以后再想查谁通过`sshd`免密登录过服务器就方便了，我们只需要执行：

```
match-ssh-keys /var/log/secure
```

就可以了。

[1]: https://gist.github.com/mschmitt/518977
