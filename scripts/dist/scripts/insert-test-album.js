"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config({ path: '.env.local' });
var supabase_js_1 = require("@supabase/supabase-js");
var supabase_1 = require("../config/supabase");
var uuid_1 = require("uuid");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var supabaseUrl, serviceKey, supabase, _a, artists, artistError, artist_id, album, _b, data, error;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    supabaseUrl = supabase_1.supabaseConfig.url, serviceKey = supabase_1.supabaseConfig.serviceKey;
                    if (!supabaseUrl || !serviceKey) {
                        console.error('Supabase URL ou Service Key não configurados.');
                        process.exit(1);
                    }
                    supabase = (0, supabase_js_1.createClient)(supabaseUrl, serviceKey);
                    return [4 /*yield*/, supabase.from('artists').select('id').limit(1)];
                case 1:
                    _a = _c.sent(), artists = _a.data, artistError = _a.error;
                    if (artistError || !artists || artists.length === 0) {
                        console.error('Não foi possível encontrar um artist_id válido.');
                        process.exit(1);
                    }
                    artist_id = artists[0].id;
                    console.log('Usando artist_id:', artist_id);
                    album = {
                        id: (0, uuid_1.v4)(),
                        title: 'Álbum de Teste',
                        artist_id: artist_id,
                        release_date: '2024-01-01',
                        cover_url: 'https://placehold.co/300x300',
                        genre: 'Pop',
                    };
                    return [4 /*yield*/, supabase.from('albums').insert([album]).select()];
                case 2:
                    _b = _c.sent(), data = _b.data, error = _b.error;
                    if (error) {
                        console.error('Erro ao inserir álbum:', error.message);
                    }
                    else {
                        console.log('Álbum inserido com sucesso:', data);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main();
