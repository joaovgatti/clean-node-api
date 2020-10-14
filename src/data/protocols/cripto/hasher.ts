export interface Hasher{
    hash(value :String): Promise<string>
}

