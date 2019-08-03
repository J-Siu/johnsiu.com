# Create aliases for old posts.

DIR="content/blog"
BEFORE=2018
#AFTER=

for i in $(ls $DIR)
do
	DATE=$(front-matter-manipulator values ${DIR}/${i} date | json date)
	YEAR=$(echo $DATE | cut -d\" -f2 | cut -d- -f1)
	if [[ ${YEAR} < 2018 ]]
	then
		echo --- ${YEAR} ${i}
		# Print Aliases
		echo ""
		echo "aliases:"
		echo "    - /${i}"
		echo "    - /index.php/${i}"
		echo ""
	fi
done