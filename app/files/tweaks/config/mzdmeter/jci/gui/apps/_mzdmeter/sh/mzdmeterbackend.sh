#!/bin/sh

timestamp=$(date +%s)

while read action
do
	break
done


if [ "${action}" == "all_value" ]
then
    TRIPDISTANCE_TRIG=0
    BAHTPERKM=0
    TRIPDISTANCE_BACK=0

    # intial value from stored file
    if [ -e /paa/MoneyAlongDistance.dat ]; then
        v1=`cat /paa/MoneyAlongDistance.dat | cut -d '.' -f1`
        v2=`cat /paa/MoneyAlongDistance.dat | cut -d '.' -f2`
	smdb-write --baseName=vdm_vdt_paa_data --entryName=MoneyAlongDistanceBaht ${v1}
        smdb-write --baseName=vdm_vdt_paa_data --entryName=MoneyAlongDistanceSatang ${v2}
    else
        smdb-write --baseName=vdm_vdt_paa_data --entryName=MoneyAlongDistanceBaht 0
        smdb-write --baseName=vdm_vdt_paa_data --entryName=MoneyAlongDistanceSatang 0
	echo "0.00" > /paa/MoneyAlongDistance.dat
	chmod 666 /paa/MoneyAlongDistance.dat
    fi
    if [ -e /paa/FuelPrice.dat ]; then
        #v1=`cat /paa/FuelPrice.dat | cut -d '.' -f1`
        #v2=`cat /paa/FuelPrice.dat | cut -d '.' -f2`
        #smdb-write --baseName=vdm_vdt_paa_data --entryName=FuelPrice ${v1}
        #smdb-write --baseName=vdm_vdt_paa_data --entryName=FuelPriceFolatingPoint ${v2}
	v1=`cat /paa/FuelPrice.dat`
	smdb-write --baseName=vdm_vdt_paa_data --entryName=FuelPriceFloating ${v1}
    else
        #smdb-write --baseName=vdm_vdt_paa_data --entryName=FuelPrice 99
        #smdb-write --baseName=vdm_vdt_paa_data --entryName=FuelPriceFolatingPoint 99
	v1=`echo "99.99"`
	smdb-write --baseName=vdm_vdt_paa_data --entryName=FuelPriceFloating ${v1}
	echo "99.99" > /paa/FuelPrice.dat
	chmod 666 /paa/FuelPrice.dat
    fi
    if [ -e /paa/StartAtDistance.dat ]; then
        PREVTOTALDISTANCE=`cat /paa/StartAtDistance.dat`
	smdb-write --baseName=vdm_vdt_paa_data --entryName=StartAtDistance ${PREVTOTALDISTANCE}
    else
	TOTALD=`smdb-read -n vdm_vdt_history_data -e TotalDistance_Trigger`
        smdb-write --baseName=vdm_vdt_paa_data --entryName=StartAtDistance ${TOTALD}
	echo "${TOTALD}" > /paa/StartAtDistance.dat
	chmod 666 /paa/StartAtDistance.dat
    fi

    # For load test Trip A Time
    if [ -e /paa/testTime.txt ]; then
        cat /paa/testTime.txt > /paa/tripATimes.dat
	rm -f /paa/testTime.txt
    fi

    if [ -e /paa/tripATimes.dat ]; then
        START_TRIP_TIME=`cat /paa/tripATimes.dat | cut -d ':' -f1`
        START_IDLE_TIME=`cat /paa/tripATimes.dat | cut -d ':' -f2`
    else
	START_TRIP_TIME=0
        START_IDLE_TIME=0
	echo "0:0" > /paa/tripATimes.tmp
	mv /paa/tripATimes.tmp /paa/tripATimes.dat
	chmod 666 /paa/tripATimes.dat
    fi

    if [ -e /paa/rpmConfigure.dat ]; then
	RPMCONFIG=`cat /paa/rpmConfigure.dat`
	smdb-write --baseName=vdm_vdt_paa_data --entryName=RPMAlarm ${RPMCONFIG}
    else
	RPMCONFIG=8000
	echo "8000" > /paa/rpmConfigure.dat
	smdb-write --baseName=vdm_vdt_paa_data --entryName=RPMAlarm ${RPMCONFIG}
    fi
    if [ -e /paa/speedRestrictConfigure.dat ]; then
	SPEEDRESTRICT120=`cat /paa/speedRestrictConfigure.dat`
	smdb-write --baseName=vdm_vdt_paa_data --entryName=SpeedRestrict120 ${SPEEDRESTRICT120}
    else
	SPEEDRESTRICT120=1
	echo "1" > /paa/speedRestrictConfigure.dat
	smdb-write --baseName=vdm_vdt_paa_data --entryName=SpeedRestrict120 ${SPEEDRESTRICT120}
    fi

    PREVTOTALDISTANCEB=`smdb-read -n vdm_vdt_history_data -e TotalDistance_Trigger`
    MNYALONGDISTB=0
    while true
    do

	# For load test Trip A Time
	if [ -e /paa/testTime.txt ]; then
		START_TRIP_TIME=`cat /paa/testTime.txt | cut -d ':' -f1`
		START_IDLE_TIME=`cat /paa/testTime.txt | cut -d ':' -f2`
		rm -f /paa/testTime.txt
	fi

	FUELEFF=`smdb-read -n vdm -e Drv1AvlFuelE`
	FUELEFFVALUE=$(($FUELEFF/10))

	TOTFUELEFF=`smdb-read -n vdm_vdt_history_data -e TotAvlFuelE`
	TOTFUELEFFVALUE=$(($TOTFUELEFF/10))

	TOTALDISTANCE=`smdb-read -n vdm_vdt_history_data -e TotalDistance_Trigger`
	if [ -e /paa/resetmile.flag ]; then
		smdb-write --baseName=vdm_vdt_paa_data --entryName=StartAtDistance ${TOTALDISTANCE}
		PREVTOTALDISTANCE=$(($TOTALDISTANCE))
		smdb-write --baseName=vdm_vdt_paa_data --entryName=MoneyAlongDistanceBaht 0
		smdb-write --baseName=vdm_vdt_paa_data --entryName=MoneyAlongDistanceSatang 0
		echo "0.00" > /paa/MoneyAlongDistance.dat
		echo "${TOTALDISTANCE}" > /paa/StartAtDistance.dat
		echo "0:0" > /paa/tripATimes.tmp
		mv /paa/tripATimes.tmp /paa/tripATimes.dat
		rm -f /paa/resetmile.flag
		TRIPDISTANCE_TRIG=0
		TRIPDISTANCE_BACK=0
		START_TRIP_TIME=0
		START_IDLE_TIME=0

	else
		PREVTOTALDISTANCE=`smdb-read --baseName=vdm_vdt_paa_data --entryName=StartAtDistance`
		
	fi
	TRIPDISTANCE=$(($TOTALDISTANCE-$PREVTOTALDISTANCE))
	TRIPDISTANCEB=$(($TOTALDISTANCE-$PREVTOTALDISTANCEB))

	FUELPRICE=`smdb-read --baseName=vdm_vdt_paa_data --entryName=FuelPriceFloating`

	baht=`smdb-read --baseName=vdm_vdt_paa_data --entryName=MoneyAlongDistanceBaht`
        satang=`smdb-read --baseName=vdm_vdt_paa_data --entryName=MoneyAlongDistanceSatang`
	MNYALONGDIST=$(echo ${baht}.${satang})
	
	if [ $FUELEFFVALUE -gt 0 ]; then 
		BAHTPERKM_TMP=`awk -v a=$FUELPRICE -v b=$FUELEFFVALUE 'BEGIN { print a / b }'`
		v1=`echo ${BAHTPERKM_TMP} | cut -d '.' -f1`
		v2=`echo ${BAHTPERKM_TMP} | cut -d '.' -f2 | cut -c1-2`
		BAHTPERKM=$(echo ${v1}.${v2})
	else
		BAHTPERKM=0
	fi

	#step to hold money accumulation in some case
	if [ $TRIPDISTANCE -eq 0 ]; then
		TRIPDISTANCE_TRIG=1
	else
		if [ $TRIPDISTANCE_TRIG -eq 0 ]; then
			TRIPDISTANCE_TRIG=`awk -v a=$TRIPDISTANCE 'BEGIN { print a + 1 }'`
		fi
	fi
	
	if [ $TRIPDISTANCE -gt $TRIPDISTANCE_TRIG ]; then
	    if [ $TRIPDISTANCE -gt $TRIPDISTANCE_BACK ]; then
		 MNYALONGDIST=`awk -v a=$MNYALONGDIST -v b=$BAHTPERKM 'BEGIN { print a + b }'`
		 MNYALONGDISTB=`awk -v a=$MNYALONGDISTB -v b=$BAHTPERKM 'BEGIN { print a + b }'`
		 v1=`echo ${MNYALONGDIST} | cut -d '.' -f1`
	         v2=`echo ${MNYALONGDIST} | cut -d '.' -f2 | cut -c1-2`
	         smdb-write --baseName=vdm_vdt_paa_data --entryName=MoneyAlongDistanceBaht ${v1}
	         smdb-write --baseName=vdm_vdt_paa_data --entryName=MoneyAlongDistanceSatang ${v2}    
	         echo "${MNYALONGDIST}" > /paa/MoneyAlongDistance.dat
		 TRIPDISTANCE_BACK=$(($TRIPDISTANCE))
	    fi
	fi

	if [ -e /jci/gui/apps/_mzdmeter/individuallogo/mzd_meter_individual.png ]; then
		INDIVIDUAL_LOGO=1
	else
		INDIVIDUAL_LOGO=0
	fi

	RPMCONFIG=`smdb-read --baseName=vdm_vdt_paa_data --entryName=RPMAlarm`
	SPEEDRESTRICT120=`smdb-read --baseName=vdm_vdt_paa_data --entryName=SpeedRestrict120`

	I3=`smdb-read --baseName=vdm_vdt_current_data --entryName=DR_IntakeAirTemp`
	I4=`smdb-read --baseName=vdm_vdt_current_data --entryName=EngClnt_Te_Actl`
	GPS=$(/usr/bin/dbus-send --print-reply --address=unix:path=/tmp/dbus_service_socket --type=method_call --dest=com.jci.lds.data /com/jci/lds/data com.jci.lds.data.GetPosition)
	if [ -n "$GPS" ]; then
		#GPSSPEED=$(echo "$GPS" | awk 'NR==8{print $2}')
		ALTITUDE=$(echo "$GPS" | awk 'NR==6{print $2}')
		HEADING=$(echo "$GPS" | awk 'NR==7{print $2}')
		LATITUDE=$(echo "$GPS" | awk 'NR==4{print $2}')
		LONGITUDE=$(echo "$GPS" | awk 'NR==5{print $2}')
	else
		#GPSSPEED=0
		ALTITUDE=0
		HEADING=0
		LATITUDE=0
		LONGITUDE=0
	fi

        echo "${FUELEFFVALUE}#${TOTFUELEFFVALUE}#${TRIPDISTANCE}#${FUELPRICE}#${MNYALONGDIST}#${BAHTPERKM}#${TRIPDISTANCEB}#${MNYALONGDISTB}#${START_TRIP_TIME}#${START_IDLE_TIME}#${INDIVIDUAL_LOGO}#${RPMCONFIG}#${SPEEDRESTRICT120}#${ALTITUDE}#${HEADING}#${LATITUDE}#${LONGITUDE}#${I3}#${I4}"
	
	sleep 1
    done
fi


## All Info group1 : fast speed response : loop infinite
## ================================================================================================
if [ "${action}" == "gear_stwhl" ]
then
	while true
	do
	     GEAR_POS=`smdb-read --baseName=vdm_vdt_current_data --entryName=TransmChangeLeverPosition`
	     I2=`smdb-read --baseName=vdm_vdt_current_data --entryName=SteeringWheel`
	     echo "${GEAR_POS}#${I2}"
	     # sleep for 200 millisec
	     sleep 0.2
	done
fi

## All Info group1 : fast speed response : loop infinite
## ================================================================================================
if [ "${action}" == "speed_rpm" ]
then
	while true
	do
	    VIHICLE_SPEED=`smdb-read -n vdm_vdt_current_data -e VehicleSpeed`
	    ENGINE_SPEED=`smdb-read -n vdm_vdt_current_data -e EngineSpeed`
	    echo "${VIHICLE_SPEED}#${ENGINE_SPEED}"
	    #sleep for 50 millisec
	    sleep 0.05
	done
fi


## One way action : no response, no loop
#Problem : system has no flush the data in buffer to file !!**** fix by try to do in 5 times, if not success then write to backup file to recovery data in anytime (in reboot state)
## ================================================================================================
if [ "${action}" == "resetDistance" ]
then
    touch /paa/resetmile.flag
fi


if [[ ${action:0:11} = "refreshFuel" ]]
then
    errCount=5
    gasType=`echo ${action} | cut -d '=' -f2`
	
	rm -f /paa/oil_price*
        rm -f /paa/process_refreshGasHtml*
        touch /paa/process_refreshGasHtml_$timestamp

	timeusec=`adjtimex | awk '/(time.tv_sec|time.tv_usec):/ { printf("%06d", $2) }'`
	    wget -O /paa/oil_price_${timeusec}.txt -q --no-check-certificate http://www.pttplc.com/th/getoilprice.aspx/
	    if [ $? -eq 0 ]; then
		if [ -e /paa/oil_price_${timeusec}.txt ]; then
		    if [ ${gasType} = "s95" ]; then // Gasoline 95
		        MNYFUEL=`cat /paa/oil_price_${timeusec}.txt | grep 'Gasoline95PriceDiv' | awk '{print substr($0,index($0, "title="))}' | cut -d '"' -f2`
		    elif [ ${gasType} = "g95" ]; then    // Gasohol 95
		        MNYFUEL=`cat /paa/oil_price_${timeusec}.txt | grep 'Gasohol95PriceDiv' | awk '{print substr($0,index($0, "title="))}' | cut -d '"' -f2`
		    elif [ ${gasType} = "e20" ]; then    // Gasohol E20
		        MNYFUEL=`cat /paa/oil_price_${timeusec}.txt | grep 'GasoholE20PriceDiv' | awk '{print substr($0,index($0, "title="))}' | cut -d '"' -f2`
		    elif [ ${gasType} = "e85" ]; then    // Gasohol E85
		        MNYFUEL=`cat /paa/oil_price_${timeusec}.txt | grep 'GasoholE85PriceDiv' | awk '{print substr($0,index($0, "title="))}' | cut -d '"' -f2`
		    elif [ ${gasType} = "Diesel" ]; then    // Diesel
		        MNYFUEL=`cat /paa/oil_price_${timeusec}.txt | grep 'DieselPriceDiv' | awk '{print substr($0,index($0, "title="))}' | cut -d '"' -f2`
	            elif [ ${gasType} = "pDiesel" ]; then    // HighForce Premium Diesel
		        MNYFUEL=`cat /paa/oil_price_${timeusec}.txt | grep 'HyForcePremiumDieselDiv' | awk '{print substr($0,index($0, "title="))}' | cut -d '"' -f2`
		    fi
		    #DATEFUEL=`cat /paa/oil_price_${timeusec}.txt | grep 'oilpricebanner-row-datetime-format' | awk '{print substr($0,index($0, "title="))}' | cut -d '"' -f2`
		    #v1=`echo ${MNYFUEL} | cut -d '.' -f1`
		    #v2=`echo ${MNYFUEL} | cut -d '.' -f2`
		    #smdb-write --baseName=vdm_vdt_paa_data --entryName=FuelPrice ${v1}
		    #smdb-write --baseName=vdm_vdt_paa_data --entryName=FuelPriceFolatingPoint ${v2}
		    
		    smdb-write --baseName=vdm_vdt_paa_data --entryName=FuelPriceFloating ${MNYFUEL}
		    
		    echo "${MNYFUEL}" > /paa/FuelPrice.dat
		fi
	    fi
	rm -f /paa/process_refreshGasHtml*
fi

if [[ ${action:0:17} = "refreshFuelManual" ]]
then
	valueIn=`echo ${action} | cut -d '=' -f2`
	smdb-write --baseName=vdm_vdt_paa_data --entryName=FuelPriceFloating ${valueIn}
	echo "${valueIn}" > /paa/FuelPrice.dat
fi

if [[ ${action:0:11} = "loggingTime" ]]
then
	valueIn=`echo ${action} | cut -d '=' -f2`
	v1=`echo ${valueIn} | cut -d ':' -f1`
	v2=`echo ${valueIn} | cut -d ':' -f2`
	if [ -z "${v1//[0-9]}" ] && [ -n "$v1" ] && [ -z "${v2//[0-9]}" ] && [ -n "$v2" ]; then
		#String is a valid integer.
		echo "${valueIn}" > /paa/tripATimes.tmp
		mv /paa/tripATimes.tmp /paa/tripATimes.dat
	fi
fi

if [[ ${action:0:9} = "rpmConfig" ]]
then
	valueIn=`echo ${action} | cut -d '=' -f2`
	if [ -z "${valueIn//[0-9]}" ] && [ -n "$valueIn" ]; then
		#String is a valid integer.
		smdb-write --baseName=vdm_vdt_paa_data --entryName=RPMAlarm ${valueIn}
		echo "${valueIn}" > /paa/rpmConfigure.dat
	fi
fi

if [[ ${action:0:9} = "speedRest" ]]
then
	valueIn=`echo ${action} | cut -d '=' -f2`
	if [ -z "${valueIn//[0-9]}" ] && [ -n "$valueIn" ]; then
		smdb-write --baseName=vdm_vdt_paa_data --entryName=SpeedRestrict120 ${valueIn}
		echo "${valueIn}" > /paa/speedRestrictConfigure.dat
	fi
fi

if [[ ${action:0:9} = "compOrClk" ]]
then
	valueIn=`echo ${action} | cut -d '=' -f2`
	if [ -z "${valueIn//[0-9]}" ] && [ -n "$valueIn" ]; then
		smdb-write --baseName=vdm_vdt_paa_data --entryName=CompassOrClock ${valueIn}
		echo "${valueIn}" > /paa/compassOrClock.dat
	fi
fi

if [[ ${action:0:9} = "proc_test" ]]
then
	for COUNT in $(seq 1 5); do
	  echo "proc_test#passed"
	  sleep 0.1
	done
fi
