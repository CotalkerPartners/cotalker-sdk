import 'module-alias/register'
import 'dotenv/config'
import * as readline from 'readline'

const argv = process.argv.slice(0,2).concat(process.argv.slice(3))
const scriptName = process.argv[2]
if (!scriptName) throw 'YOU MUST PROVIDE A SCRIPT NAME'

function promptUser(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`Do you want to continue? (Y/N) `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().startsWith('y'));
    });
  });
}

const runner = async () => {
  try {
    const envVar = process.env.BASE_URL
    console.log(`Environment: ${envVar}`)
    // Check if the environment variable is defined
    if (!envVar) {
      console.log('Environment variable not set. Exiting...');
      process.exit(1);
    }

    // Prompt the user for continuation
    const shouldContinue = await promptUser();
    if (!shouldContinue) process.exit(1)
    const { main } = await import(`./${scriptName}`)
    await main(argv)
  } catch (error) {
    console.error(error)
  }
}

runner()
