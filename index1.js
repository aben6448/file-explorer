var fs = require('fs'),
	stdin = process.stdin,
	stdout = process.stdout;
var stats = [];
var nowFiles =[];
var curDir='';

console.log('	\033[33mWelcome to a console file explorer! \033[39m');
console.log('	you can quit by enter \'exit\' at any time.')
//while(1)
{
	
	console.log('	Please enter the path you want to see.');
	//stdin.pause();
	stdin.resume();
	stdin.setEncoding('utf8');
	stdin.on('data',readdirdiy);

}


function readdirdiy(data)
{
	var input = String(data).replace('\n','');
	if (input == 'exit') {process.exit(1);};

	var stat;
	if (isNaN(Number(input))) {
		try
		{
			if (input == 'b') //go back to the parent folder
			{
				curDir = curDir.substr(0,curDir.lastIndexOf('/'));
			}
			else
				curDir = input;
			stat = fs.statSync(curDir);
			
		}
		catch(error)
		{

		}
		
	}
	else
	{
		if (nowFiles[Number(input)]) {
			curDir = curDir+'/'+nowFiles[input];
			stat = fs.statSync(curDir);

		}
	}
	if (stat != undefined) {
		if (stat.isDirectory()) {
			fs.readdir(curDir,function(err,files){
				
				nowFiles = files;
				console.log('');
				if(err)
				{
					if(err.code == 'EACCES')
					{
						console.log('Access Denied! Please run again with root.');
						process.exit(1);
					}
					else
						throw err;
				}

				if(!files.length)
				{
					return console.log('	\033[31m No files to show!\033[39m\n');
				}
				

				function file(i)
				{
					var filename = files[i];
					fs.stat(curDir+'/'+filename,function(err,stat){
						
						stats[i] = stat;
						if(stat.isDirectory())
						{
							console.log('	'+i+'	\033[36m'+filename+'/\033[39m');
						}
						else
						{
							console.log('	'+i+'	\033[36m'+filename+'\033[39m');
						}

						i++;
						if (i!=files.length) {
							file(i);
						}
						else
						{
							console.log('\n	Select which file or direcroty you want to see');
							console.log('	or');
							console.log('	you can just enter another path to see');
							console.log('	or');
							console.log('	enter "b" to go to the parent folder.\n');
						}
					});
				}
				file(0);
			});
		}
		else
		{
			var filename=nowFiles[Number(input)];
			if(!filename)
			{
				stdout.write('	\033[31mEnter your choice: \033[39m');
			}
			else
			{
				//stdin.pause();
				//console.log(stats[Number(data)]);
				
				fs.readFile(curDir,'utf8',function(err,data){
					console.log('');
					console.log('\033[90m'+data.replace(/(.*)/g,'	$1')+'\033[39m');

					console.log('	Please enter the path you want to see.');
		
					stdin.resume();
					stdin.setEncoding('utf8');
				});
			}
		}
	}
	else
	{
		console.log('	No such path!');
		console.log('	Please enter the path you want to see.');
		
		stdin.resume();
		stdin.setEncoding('utf8');
	}

}

