export const normalizeText=(v="")=>String(v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
export function searchProducts(products,query,limit=25){const q=normalizeText(query);return q?products.filter(p=>normalizeText(`${p.descricao} ${p.idProduto} ${p.ean}`).includes(q)).slice(0,limit):[]}
export function validateQuantity(value){const n=Number(value);return Number.isInteger(n)&&n>0?n:null}
export function csvEscape(value){const text=String(value??"");return /[";\r\n]/.test(text)?`"${text.replaceAll('"','""')}"`:text}
export function countsToCsv(counts){return `\ufeff${["IDPRODUTO;EAN;DESCRICAOPRODUTO;QUANTIDADE",...counts.map(i=>[i.idProduto,i.ean,i.descricao,i.quantidade].map(csvEscape).join(";"))].join("\r\n")}`}
