import { FileSystem } from './fileSystem';

interface CommandResult {
  output: string;
  error?: boolean;
}

const fileSystem = new FileSystem();

const commands: Record<string, (args: string[]) => CommandResult> = {
  help: () => ({
    output: `Available commands:
  help - Show this help message
  echo [text] - Display text
  clear - Clear the terminal
  date - Show current date and time
  ls - List files and directories
  pwd - Print working directory
  mkdir [name] - Create a new directory
  cd [path] - Change current directory`
  }),
  
  echo: (args) => ({
    output: args.join(' ')
  }),
  
  clear: () => ({
    output: '\x1bc' // ANSI escape code to clear screen
  }),
  
  date: () => ({
    output: new Date().toLocaleString()
  }),
  
  ls: () => ({
    output: fileSystem.listDirectory().join('\n')
  }),
  
  pwd: () => ({
    output: fileSystem.getCurrentPath()
  }),

  mkdir: (args) => {
    if (args.length !== 1) {
      return {
        output: 'Usage: mkdir <directory-name>',
        error: true
      };
    }

    const success = fileSystem.makeDirectory(args[0]);
    if (!success) {
      return {
        output: `mkdir: cannot create directory '${args[0]}': File exists or invalid path`,
        error: true
      };
    }
    return { output: '' };
  },

  cd: (args) => {
    if (args.length !== 1) {
      return {
        output: 'Usage: cd <path>',
        error: true
      };
    }

    const success = fileSystem.changeDirectory(args[0]);
    if (!success) {
      return {
        output: `cd: no such directory: ${args[0]}`,
        error: true
      };
    }
    return { output: '' };
  }
};

export const executeCommand = (input: string): CommandResult => {
  const [cmd, ...args] = input.trim().split(' ');
  
  if (!cmd) return { output: '' };
  
  const command = commands[cmd];
  if (!command) {
    return {
      output: `Command not found: ${cmd}. Type 'help' for available commands.`,
      error: true
    };
  }
  
  return command(args);
};

export const getCommandSuggestions = (partial: string): string[] => {
  if (!partial) return Object.keys(commands);
  return Object.keys(commands).filter(cmd => 
    cmd.startsWith(partial.toLowerCase())
  );
};