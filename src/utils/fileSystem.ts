interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  children?: Map<string, FileSystemNode>;
}

export class FileSystem {
  private root: FileSystemNode;
  private currentPath: string[] = [];

  constructor() {
    this.root = {
      name: '/',
      type: 'directory',
      children: new Map([
        ['Documents', { name: 'Documents', type: 'directory', children: new Map() }],
        ['Downloads', { name: 'Downloads', type: 'directory', children: new Map() }],
        ['Pictures', { name: 'Pictures', type: 'directory', children: new Map() }],
        ['example.txt', { name: 'example.txt', type: 'file' }],
        ['script.js', { name: 'script.js', type: 'file' }],
      ])
    };
  }

  getCurrentPath(): string {
    return '/' + this.currentPath.join('/');
  }

  private getNodeAtPath(path: string[]): FileSystemNode | undefined {
    let current = this.root;
    for (const segment of path) {
      if (segment === '' || segment === '.') continue;
      if (segment === '..') {
        path.pop();
        continue;
      }
      if (!current.children?.has(segment)) return undefined;
      current = current.children.get(segment)!;
    }
    return current;
  }

  listDirectory(): string[] {
    const node = this.getNodeAtPath(this.currentPath);
    if (!node || node.type !== 'directory') return [];
    return Array.from(node.children?.keys() || []);
  }

  makeDirectory(name: string): boolean {
    const current = this.getNodeAtPath(this.currentPath);
    if (!current || current.type !== 'directory') return false;
    if (!current.children) current.children = new Map();
    
    if (current.children.has(name)) return false;
    
    current.children.set(name, {
      name,
      type: 'directory',
      children: new Map()
    });
    return true;
  }

  changeDirectory(path: string): boolean {
    const segments = path.split('/').filter(Boolean);
    const targetPath = [...this.currentPath];

    if (path.startsWith('/')) {
      targetPath.length = 0;
    }

    for (const segment of segments) {
      if (segment === '..') {
        if (targetPath.length > 0) {
          targetPath.pop();
        }
      } else if (segment !== '.') {
        const current = this.getNodeAtPath(targetPath);
        if (!current?.children?.has(segment)) return false;
        if (current.children.get(segment)!.type !== 'directory') return false;
        targetPath.push(segment);
      }
    }

    this.currentPath = targetPath;
    return true;
  }
}