export class ImageInfo {
    public width: number;
    public height: number;
    public averageColor: string;
    public path: string;
    public extension: string;
    public mimeType: string;

    public constructor(init?:Partial<ImageInfo>) {
        Object.assign(this, init);
    }
}