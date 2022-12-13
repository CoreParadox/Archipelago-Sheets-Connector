const regex = /([\w\s]+)\ssent\s(.+)\sto\s([\w\s]+)\s\(/gm;

export default class Log{

    constructor(private readonly log:string){}

    get asCSV(){
        const arr = [...this.log.matchAll(regex)].map(a => [a[1],a[2],a[3]].join(',').trim())
        return arr.join('\n');
    }
    
    get asArray(){
        return [...this.log.matchAll(regex)].map(a => [a[1],a[2],a[3]])
    }
}