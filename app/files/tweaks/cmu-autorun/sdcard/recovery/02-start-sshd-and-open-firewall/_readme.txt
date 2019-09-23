this script run a new sshd server on port 24000 and openup firewall on eth and wifi

start-sshd-and-open-firewall.autorun:
this script run "start_fw_in_background" in background because we need to openup the firewall two times with 90 sec difference

start_fw_in_background:
start a new sshd config with our config file "sshd_config" from this dir with modified settings: accept password auth, port 24000 (original sshd is on 36000 and not acceptd password auth)
"sshd_config" is a modified copy of /etc/ssh/sshd_config

"jci-fw.sh":
open up firewall for tcp port 24000,36000 and icmp on eth and wifi
wait 90sec
CMUs start his firewall and close opened ports
run "jci-fw.sh" again to open again the firewall
