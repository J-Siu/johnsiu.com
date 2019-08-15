# Create aliases for old posts.

DIR="content/blog"
BEFORE=2018
#AFTER=

for i in $(ls $DIR)
do
	DATE=$(front-matter-manipulator values ${DIR}/${i} date | json date)
	YEAR=$(echo $DATE | cut -d\" -f2 | cut -d- -f1)
	MON=$(echo $DATE | cut -d\" -f2 | cut -d- -f2)
	DAY=$(echo $DATE | cut -d\" -f2 | cut -d- -f3 | cut -dT -f1)

#	echo ${DATE} ${YEAR} ${MON} ${DAY}

	if [[ ${YEAR} < 2018 ]]
	then
		echo --- ${YEAR}/${MON}/${DAY} ${i}
		# Print Aliases
		echo ""
		echo "aliases:"
		echo "    - /${i}"
		echo "    - /index.php/${i}"
		echo "    - /index.php/${YEAR}/${MON}/${DAY}/${i}"
		echo ""
	fi
done