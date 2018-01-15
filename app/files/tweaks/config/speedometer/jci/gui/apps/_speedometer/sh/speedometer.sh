#!/bin/sh

while read action
do
    break
done

## Vehicle Data (.5 seconds)
## ================================================================================================
if [ "${action}" == "vehicleData" ]
then
    while true
    do
      GPS=$(/usr/bin/dbus-send --print-reply --address=unix:path=/tmp/dbus_service_socket --type=method_call --dest=com.jci.lds.data /com/jci/lds/data com.jci.lds.data.GetPosition)

      GPSSPEED=$(echo "$GPS" | awk 'NR==8{print $2}')
      ALTITUDE=$(echo "$GPS" | awk 'NR==6{print $2}')
      HEADING=$(echo "$GPS" | awk 'NR==7{print $2}')
      LATITUDE=$(echo "$GPS" | awk 'NR==4{print $2}')
      LONGITUDE=$(echo "$GPS" | awk 'NR==5{print $2}')
      RPM=`smdb-read -n vdm_vdt_current_data -e EngineSpeed`
      DIST=`smdb-read -n vdm -e PID_Drv1Dstnc_curr`
      SPEED=`smdb-read -n vdm_vdt_current_data -e VehicleSpeed`
      ENGLOAD=`smdb-read -n vdm_vdt_current_data -e EngineLoad`
      LPOS=`smdb-read -n vdm_vdt_current_data -e TransmChangeLeverPosition`
      echo "vehicleData#${SPEED}#${RPM}#${DIST}#${GPSSPEED}#${ALTITUDE}#${HEADING}#${LATITUDE}#${LONGITUDE}#${ENGLOAD}#${LPOS}"
      sleep 0.5
    done
fi

## Environment Data
## ================================================================================================
if [ "${action}" == "envData" ]
then
  while true
  do
    FUELGAGE=`smdb-read -n vdm_vdt_current_data -e FuelGaugePosition`
    FUELEFF=`smdb-read -n vdm -e Drv1AvlFuelE`
    TOTFUELEFF=`smdb-read -n vdm_vdt_history_data -e TotAvlFuelE`
    AVGFUEL=`smdb-read -n vdm_history_data -e HVD_CumAvgFuelEff_curr`
    CTMP=`smdb-read -n vdm_vdt_current_data -e EngClnt_Te_Actl`
    ITMP=`smdb-read -n vdm_vdt_current_data -e DR_IntakeAirTemp`
    OTMP=`smdb-read -n vdm_vdt_current_data -e Out-CarTemperature`
   # LTMP=`smdb-read -n vdm_vdt_current_data -e Out-CarTemperature`
    BATSOC=`smdb-read -n vdm_vdt_current_data -e Battery_StateOfCharge`
   # BATSOC=`smdb-read -n vdm_vdt_current_data -e BattTracSoc_Pc_Actl`
    GPOS=`smdb-read -n vdm_vdt_current_data -e TransmissionGearPosition`
    echo "envData#${FUELEFF}#${TOTFUELEFF}#${AVGFUEL}#${OTMP}#${ITMP}#${CTMP}#${GPOS}#${FUELGAGE}#${BATSOC}"
    sleep 3.0
  done
fi


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

## Outside, Intake, & Coolant Temperatures
## ================================================================================================
if [ "${action}" == "temperature" ]
then
    while true
    do
        CTMP=`smdb-read -n vdm_vdt_current_data -e EngClnt_Te_Actl`
        ITMP=`smdb-read -n vdm_vdt_current_data -e DR_IntakeAirTemp`
        OTMP=`smdb-read -n vdm_vdt_current_data -e Out-CarTemperature`
        echo "temperature#${OTMP}#${ITMP}#${CTMP}"
        sleep 5
    done
fi

## Gear Position
## ================================================================================================
if [ "${action}" == "gearPos" ]
then
  while true
  do
    GPOS=`smdb-read -n vdm_vdt_current_data -e TransmissionGearPosition`
    echo "gearPos#${GPOS}"
    sleep 3
  done
fi
