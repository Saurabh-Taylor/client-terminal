export class CommandHistory {
  private history: string[] = [];
  private position: number = 0;
  
  add(command: string) {
    if (command.trim()) {
      this.history.push(command);
      this.position = this.history.length;
    }
  }
  
  getPrevious(): string | null {
    if (this.position > 0) {
      this.position--;
      return this.history[this.position];
    }
    return null;
  }
  
  getNext(): string | null {
    if (this.position < this.history.length - 1) {
      this.position++;
      return this.history[this.position];
    }
    return null;
  }
  
  reset() {
    this.position = this.history.length;
  }
}