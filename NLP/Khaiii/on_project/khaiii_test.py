from khaiii import KhaiiiApi
api = KhaiiiApi()
f = open('input.txt', 'r')
lines = f.readlines()
output = open('output.txt', 'w')
for line in lines:
	for word in api.analyze(line):
		output.write(str(word)+'\n')
	output.write('-------------------------------------------------')
