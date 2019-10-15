export class RequestUtil {

    private static readonly SEPARATOR = '/';
    private static readonly OBJECT_REMOVE_KEYS = ['id']

    public static buildRequestPath(addLastSeparator: boolean, ...args: any): string {
        let path: string = args.join(RequestUtil.SEPARATOR);
        if (addLastSeparator) {
            path += RequestUtil.SEPARATOR;
        }
        return path;
    }

    public static cloneObjectBeforeSave(object) {
        var result = {};
        Object.keys(object).forEach((key) => {
            if (RequestUtil.OBJECT_REMOVE_KEYS.includes(key) === false) {
                result[key] = object[key];
            }
        });
        return result;
    }
}