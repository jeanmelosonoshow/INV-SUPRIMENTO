import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import XLSX from "xlsx";

const root = process.cwd();
const names = ["CADASTRO PRODUTOS SUPRIMENTO.xls", "CADASTRO PRODUTOS SUPRIMENTO.xlsx"];
const input = names.map((name) => path.join(root, name)).find(fs.existsSync);
if (!input) throw new Error(`Arquivo não encontrado. Coloque ${names.join(" ou ")} na raiz do projeto.`);

const workbook = XLSX.read(fs.readFileSync(input), { type: "buffer", cellDates: false, raw: false });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
const header = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toUpperCase();
const get = (row, expected) => { const key = Object.keys(row).find((name) => header(name) === expected); return key ? String(row[key]).trim() : ""; };
const products = rows.map((row) => ({ idProduto: get(row, "IDPRODUTO"), ean: get(row, "EAN"), descricao: get(row, "DESCRICAOPRODUTO") })).filter((p) => p.idProduto || p.ean || p.descricao);
if (!products.length) throw new Error("Nenhum produto foi encontrado na primeira aba da planilha.");
const invalid = products.filter((p) => !p.idProduto || !p.descricao);
if (invalid.length) throw new Error(`${invalid.length} linha(s) sem IDPRODUTO ou DESCRICAOPRODUTO.`);
const seen = new Set();
for (const product of products) { if (seen.has(product.idProduto)) throw new Error(`IDPRODUTO duplicado: ${product.idProduto}`); seen.add(product.idProduto); }
products.sort((a, b) => a.descricao.localeCompare(b.descricao, "pt-BR"));
fs.mkdirSync(path.join(root, "data"), { recursive: true });
fs.writeFileSync(path.join(root, "data", "products.json"), `${JSON.stringify(products, null, 2)}\n`);
console.log(`${products.length} produtos convertidos para data/products.json.`);
