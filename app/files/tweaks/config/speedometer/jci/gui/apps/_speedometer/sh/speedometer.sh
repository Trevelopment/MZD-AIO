#!/bin/sh

while read action
do
    break
done

## Vehicle Speed
## ================================================================================================
if [ "${action}" == "vehicleSpeed" ]
then
    while true
    do
        SPEED=`smdb-read -n vdm_vdt_current_data -e VehicleSpeed`
        echo "vehicleSpeed#${SPEED}"
        sleep 0.5
    done
fi

## Fuel Efficiency
## ================================================================================================
if [ "${action}" == "fuelEfficiency" ]
then
    while true
    do
        FUELEFF=`smdb-read -n vdm -e Drv1AvlFuelE`
        echo "fuelEfficiency#${FUELEFF}"
        sleep 3.0
    done
fi

## Total Fuel Efficiency
## ================================================================================================
if [ "${action}" == "totfuelEfficiency" ]
then
    while true
    do
        TOTFUELEFF=`smdb-read -n vdm_vdt_history_data -e TotAvlFuelE`
        echo "totfuelEff#${TOTFUELEFF}"
        sleep 3.0
    done
fi

## Drive Distance
## ================================================================================================
if [ "${action}" == "drivedist" ]
then
    while true
    do
        DIST=`smdb-read -n vdm -e PID_Drv1Dstnc_curr`
        echo "drivedist#${DIST}"
        sleep 0.5
    done
fi

## GPS Data
## ================================================================================================
if [ "${action}" == "gpsdata" ]
then
    while true
    do

        GPS=$(/usr/bin/dbus-send --print-reply --address=unix:path=/tmp/dbus_service_socket --type=method_call --dest=com.jci.lds.data /com/jci/lds/data com.jci.lds.data.GetPosition)

        GPSSPEED=$(echo "$GPS" | awk 'NR==8{print $2}')
        ALTITUDE=$(echo "$GPS" | awk 'NR==6{print $2}')
        HEADING=$(echo "$GPS" | awk 'NR==7{print $2}')
        LATITUDE=$(echo "$GPS" | awk 'NR==4{print $2}')
        LONGITUDE=$(echo "$GPS" | awk 'NR==5{print $2}')

        echo "gpsdata#${GPSSPEED}#${ALTITUDE}#${HEADING}#${LATITUDE}#${LONGITUDE}"
        sleep 0.5

    done
fi

## Engine RPM
## ================================================================================================
if [ "${action}" == "engineSpeed" ]
then
    while true
    do
        RPM=`smdb-read -n vdm_vdt_current_data -e EngineSpeed`
        echo "engineSpeed#${RPM}"
        sleep 0.5
    done
fi
