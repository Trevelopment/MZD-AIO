#!/bin/sh
export PATH=$PATH:/tmp
mkdir /config-mfg
mount -t squashfs  /dev/mtdblock5 /config-mfg
/tmp/config-update.sh --start

cp /tmp/passwd /tmp/configtmp/passwd
cp /tmp/authorized_keys /tmp/configtmp/authorized_keys
    
/tmp/config-update.sh --commit
