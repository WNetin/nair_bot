export interface GuildData {
    logs?: {
        channel?: {
            id?: string;
        };
        chatChannel?: {
            id?: string;
            webhook?: {
                id?: string;
                token?: string;
            };
        };
        joinAlert?:{
            on?: boolean;
            audios?:[{
                url?: string;
                name?: string;
            }]
        }
    };

}
