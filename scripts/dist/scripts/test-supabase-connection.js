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
// scripts/test-supabase-connection.ts
var dotenv = require("dotenv");
dotenv.config({ path: '.env.local' });
require("dotenv/config");
var supabase_js_1 = require("@supabase/supabase-js");
var supabase_1 = require("../config/supabase");
/**
 * Script para testar a conexão com o Supabase
 *
 * Executar com: npx ts-node scripts/test-supabase-connection.ts
 *
 * Certifique-se de que as variáveis de ambiente estão configuradas:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var supabaseUrl, supabaseAnonKey, supabase, _a, data, error, testEmail_1, testPassword, _b, authData, authError, serviceKey, adminClient, _c, userData, userError, user, error_1, _d, albums, albumsError, error_2;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 10, , 11]);
                    supabaseUrl = supabase_1.supabaseConfig.url, supabaseAnonKey = supabase_1.supabaseConfig.anonKey;
                    console.log('Configuração do Supabase:');
                    console.log("URL: ".concat(supabaseUrl || 'Não configurada'));
                    console.log("Chave An\u00F4nima: ".concat(supabaseAnonKey ? 'Configurada' : 'Não configurada'));
                    if (!supabaseUrl || !supabaseAnonKey) {
                        console.error('\nErro: Variáveis de ambiente do Supabase não estão definidas');
                        process.exit(1);
                    }
                    // Criar cliente
                    console.log('\nCriando cliente Supabase...');
                    supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
                    // Testar conexão
                    console.log('Testando conexão...');
                    return [4 /*yield*/, supabase.auth.getSession()];
                case 1:
                    _a = _g.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        throw error;
                    }
                    console.log('\nConexão bem-sucedida!');
                    console.log("Sess\u00E3o atual: ".concat(data.session ? 'Autenticado' : 'Não autenticado'));
                    // Testar autenticação
                    console.log('\nTestando autenticação com email/senha...');
                    testEmail_1 = 'admin@eimusic.co.mz';
                    testPassword = 'admin123';
                    return [4 /*yield*/, supabase.auth.signInWithPassword({
                            email: testEmail_1,
                            password: testPassword,
                        })];
                case 2:
                    _b = _g.sent(), authData = _b.data, authError = _b.error;
                    if (!authError) return [3 /*break*/, 7];
                    console.error("\nErro ao autenticar com ".concat(testEmail_1, ": ").concat(authError.message));
                    // Verificar se o usuário existe
                    console.log('\nVerificando se o usuário existe...');
                    serviceKey = supabase_1.supabaseConfig.serviceKey;
                    if (!serviceKey) {
                        console.error('Erro: Chave de serviço não configurada');
                        process.exit(1);
                    }
                    adminClient = (0, supabase_js_1.createClient)(supabaseUrl, serviceKey);
                    _g.label = 3;
                case 3:
                    _g.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, adminClient.auth.admin.listUsers()];
                case 4:
                    _c = _g.sent(), userData = _c.data, userError = _c.error;
                    if (userError) {
                        throw userError;
                    }
                    user = userData.users.find(function (u) { return u.email === testEmail_1; });
                    if (user) {
                        console.log("Usu\u00E1rio ".concat(testEmail_1, " existe no Supabase."));
                        console.log('O problema pode ser com a senha ou com as permissões.');
                    }
                    else {
                        console.log("Usu\u00E1rio ".concat(testEmail_1, " N\u00C3O existe no Supabase."));
                        console.log('Execute o script create-test-user.ts para criar o usuário de teste.');
                    }
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _g.sent();
                    console.error('Erro ao verificar usuário:', error_1);
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 8];
                case 7:
                    console.log('\nAutenticação bem-sucedida!');
                    console.log("Usu\u00E1rio: ".concat((_e = authData.user) === null || _e === void 0 ? void 0 : _e.email));
                    console.log("ID: ".concat((_f = authData.user) === null || _f === void 0 ? void 0 : _f.id));
                    _g.label = 8;
                case 8:
                    // Testar leitura da tabela "albums" com a chave anon
                    console.log('\nTestando leitura da tabela "albums"...');
                    return [4 /*yield*/, supabase
                            .from('albums')
                            .select('*')];
                case 9:
                    _d = _g.sent(), albums = _d.data, albumsError = _d.error;
                    if (albumsError) {
                        console.error('Erro ao buscar álbuns:', albumsError.message);
                    }
                    else {
                        console.log("\u00C1lbuns encontrados: ".concat(albums.length));
                        console.dir(albums, { depth: null });
                    }
                    return [3 /*break*/, 11];
                case 10:
                    error_2 = _g.sent();
                    console.error('\nErro ao testar conexão:', error_2);
                    process.exit(1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
main();
