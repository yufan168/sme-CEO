# -*- coding: utf-8 -*-
import sys, json, os
sys.path.insert(0, '/root/.claude/skills/n8n-workflow-generator/scripts')
from generate_workflow import generate_workflow

COMPANY = (
    '公司資料：享洺有限公司，企業管理顧問，2021 年成立，5 人以下，負責人 SUSU。'
    '業務範圍：企業管理顧問、教育訓練、政府計畫輔導、ISO 制度升級與改版輔導、'
    'ESG 與碳管理、知識與教材管理、客戶服務、營運與財務管理。'
)

GOV = (
    '治理限制：本產出屬 Level 0 僅內部使用，只給負責人閱讀，不得對外發送。'
    '不得產生任何對客戶的承諾、報價、折扣、費用或交期。'
    '無法確認的事實一律標示【待確認】，不得編造。'
    '資料不足時明確說明資料不足，不得推測補齊。'
)

def ai_node(name, position, system_prompt, user_expr, temperature=0.2):
    body = (
        "={{ JSON.stringify({ model: 'gpt-4o', temperature: " + str(temperature) +
        ", messages: [ { role: 'system', content: " + json.dumps(system_prompt, ensure_ascii=False) +
        " }, { role: 'user', content: " + user_expr + " } ] }) }}"
    )
    return {
        'name': name,
        'type': 'n8n-nodes-base.httpRequest',
        'position': position,
        'parameters': {
            'method': 'POST',
            'url': 'https://api.openai.com/v1/chat/completions',
            'authentication': 'predefinedCredentialType',
            'nodeCredentialType': 'openAiApi',
            'sendBody': True,
            'specifyBody': 'json',
            'jsonBody': body,
            'options': {'timeout': 60000},
        },
        'credentials': {'openAiApi': {'id': 'OPENAI_CRED_ID', 'name': 'OpenAI（請替換）'}},
    }

S01 = (
    '你是享洺有限公司的 S01 經營資料整理員。'
    '職責：彙整案件、營收、政府計畫與課程資料，形成可供經營判斷的摘要。'
    '請依下列主題分類整理：顧問專案、教育訓練、政府計畫、ISO 制度輔導、ESG 碳管理、'
    '知識與教材、客戶服務、營運與財務。'
    '去除雜訊、保留關鍵數字，以條列方式呈現。'
    '工作邊界：只整理資料，不解釋公司應採取何種策略，不評論，不臆測缺漏的數字。'
    '原始資料裡沒有的項目一律列在【資料缺口】，不得自行補值。'
    + COMPANY + GOV
)

O01 = (
    '你是享洺有限公司的 O01 待辦整理員。'
    '職責：把郵件、會議與各案事項整理成責任人、期限與待辦清單。'
    '每項標明所屬業務線與建議優先序（高、中、低）。'
    '工作邊界：資訊不足以判斷責任人時標記為【待指派】，不得虛構。'
    '沒有明確期限者標示【待負責人設定】，不得自行設定期限，'
    '也不得寫出任何會被理解為對客戶承諾的日期。'
    + COMPANY + GOV
)

O03 = (
    '你是享洺有限公司的 O03 期限與異常監測員。'
    '職責：標示案件逾期、應收逾期、政府計畫查核點與法定申報期限，'
    '每項說明異常點與可能影響。'
    '工作邊界：沒有明顯異常時明確回覆今日無重大異常，不得為了湊數而編造。'
    '不得判定責任歸屬，不得決定處理方式，不得預告主管機關的審查結果。'
    + COMPANY + GOV
)

S02 = (
    '你是享洺有限公司的 S02 方案比較分析員。'
    '職責：針對今日需要負責人決定的事項，整理可行選項的成本、效益與風險，供負責人取捨。'
    '每一項都要標示【需負責人決定】。'
    '工作邊界：只能提出比較，不能替公司決定方向或預算，'
    '不得寫出任何要給客戶看的金額、折扣或交期。'
    '若今日沒有需要決定的事項，明確回覆今日無待決事項。'
    + COMPANY + GOV
)

ASSEMBLE_JS = r"""
// 組裝每日營運摘要。這一步刻意不呼叫 AI：
// 四位 Agent 的產出直接原文拼接，避免再經一次改寫而混入沒有依據的內容。
const pick = (name) => {
  try {
    const payload = $(name).first().json;
    const text = payload && payload.choices && payload.choices[0]
      && payload.choices[0].message && payload.choices[0].message.content;
    return text && String(text).trim() ? String(text).trim() : '【本節點沒有產出，請查看 n8n 執行紀錄】';
  } catch (err) {
    return '【本節點沒有產出，請查看 n8n 執行紀錄】';
  }
};

const today = $now.toFormat('yyyy-MM-dd');

const lines = [
  '享洺有限公司　每日營運摘要　' + today,
  '',
  '【使用限制】',
  '本摘要屬 Level 0 僅內部使用，只給負責人閱讀。',
  '不得轉寄客戶，不得作為對外回覆的依據。',
  '內容由 AI 整理，未經人工核准前不得引用為正式結論。',
  '標示【待確認】【待指派】【待負責人設定】【資料缺口】的項目，一律需要人補齊。',
  '',
  '一、營運資訊（S01 經營資料整理員）',
  pick('S01 經營資料整理員'),
  '',
  '二、待辦與優先序（O01 待辦整理員）',
  pick('O01 待辦整理員'),
  '',
  '三、期限與異常（O03 期限與異常監測員）',
  pick('O03 期限與異常監測員'),
  '',
  '四、需負責人決定（S02 方案比較分析員）',
  pick('S02 方案比較分析員'),
  '',
  '本摘要到此為止。任何對外回覆、報價、承諾與申報，仍須由負責人另行決定並由人送出。',
];

return [{ json: { subject: '享洺每日營運摘要　' + today, body: lines.join('\n'), date: today }, pairedItem: 0 }];
""".strip()

spec = {
    'name': '享洺每日營運摘要（四 Agent 接力，Level 0 僅內部使用）',
    'version': '1.x-stable',
    'industry': 'general',
    'nodes': [
        {
            'name': '每日排程觸發',
            'type': 'n8n-nodes-base.scheduleTrigger',
            'position': [80, 300],
            'parameters': {'rule': {'interval': [{'field': 'cronExpression', 'expression': '30 8 * * *'}]}},
        },
        {
            'name': '收集營運資料',
            'type': 'n8n-nodes-base.httpRequest',
            'position': [300, 300],
            'parameters': {
                'method': 'GET',
                'url': '【請填入：享洺營運資料 API 網址】',
                'authentication': 'genericCredentialType',
                'genericAuthType': 'httpHeaderAuth',
                'sendHeaders': True,
                'headerParameters': {'parameters': [{'name': 'Accept', 'value': 'application/json'}]},
                'options': {'timeout': 60000},
                'alwaysOutputData': False,
            },
            'credentials': {'httpHeaderAuth': {'id': 'OPS_API_CRED_ID', 'name': '營運資料 API（請替換）'}},
        },
        ai_node('S01 經營資料整理員', [520, 300], S01,
                "'以下是今日收集到的原始營運資料：' + JSON.stringify($('收集營運資料').item.json)"),
        ai_node('O01 待辦整理員', [740, 300], O01,
                "'以下是 S01 彙整的營運資訊：' + $('S01 經營資料整理員').item.json.choices[0].message.content"),
        ai_node('O03 期限與異常監測員', [960, 300], O03,
                "'以下是 S01 彙整的營運資訊：' + $('S01 經營資料整理員').item.json.choices[0].message.content"),
        ai_node('S02 方案比較分析員', [1180, 300], S02,
                "'【營運資訊】' + $('S01 經營資料整理員').item.json.choices[0].message.content + '　【待辦事項】' + $('O01 待辦整理員').item.json.choices[0].message.content + '　【期限與異常】' + $('O03 期限與異常監測員').item.json.choices[0].message.content",
                temperature=0.3),
        {
            'name': '組裝每日營運摘要',
            'type': 'n8n-nodes-base.code',
            'position': [1400, 300],
            'parameters': {'mode': 'runOnceForAllItems', 'jsCode': ASSEMBLE_JS},
        },
        {
            'name': '寄送給負責人',
            'type': 'n8n-nodes-base.emailSend',
            'position': [1620, 300],
            'parameters': {
                'fromEmail': '【請填入：寄件者信箱】',
                'toEmail': '【請填入：負責人收件信箱】',
                'subject': '={{ $json.subject }}',
                'emailFormat': 'text',
                'text': '={{ $json.body }}',
                'options': {},
            },
            'credentials': {'smtp': {'id': 'SMTP_CRED_ID', 'name': '寄信 SMTP（請替換）'}},
        },
        {
            'name': '錯誤觸發器',
            'type': 'n8n-nodes-base.errorTrigger',
            'position': [80, 580],
            'parameters': {},
        },
        {
            'name': '錯誤通知',
            'type': 'n8n-nodes-base.emailSend',
            'position': [300, 580],
            'parameters': {
                'fromEmail': '【請填入：寄件者信箱】',
                'toEmail': '【請填入：負責人收件信箱】',
                'subject': '【警告】享洺每日營運摘要工作流執行失敗',
                'emailFormat': 'text',
                'text': "={{ '享洺每日營運摘要工作流執行失敗。　失敗節點：' + ($json.execution && $json.execution.lastNodeExecuted ? $json.execution.lastNodeExecuted : '未知') + '　今日沒有產生摘要，請至 n8n 執行紀錄查看詳情。不要把這封信當成今日無異常。' }}",
                'options': {},
            },
            'credentials': {'smtp': {'id': 'SMTP_CRED_ID', 'name': '寄信 SMTP（請替換）'}},
        },
        {
            'name': '治理註記',
            'type': 'n8n-nodes-base.stickyNote',
            'position': [80, 40],
            'parameters': {
                'width': 720,
                'height': 200,
                'content': (
                    '## 享洺治理規則（Level 0 僅內部使用）\n\n'
                    '收件人只能是負責人。這條流程不得新增任何對外發送節點。\n'
                    '四位 Agent 只做整理、彙整與比較，不得產生對客承諾、報價、折扣或交期。\n'
                    '組裝節點刻意不呼叫 AI，四段產出原文拼接，避免再改寫時混入沒有依據的內容。\n'
                    '要改成對客戶發送，必須先加人工核准節點，並依審核規則判定 Level。'
                ),
            },
        },
    ],
    'connections': [
        {'from': '每日排程觸發', 'to': '收集營運資料'},
        {'from': '收集營運資料', 'to': 'S01 經營資料整理員'},
        {'from': 'S01 經營資料整理員', 'to': 'O01 待辦整理員'},
        {'from': 'O01 待辦整理員', 'to': 'O03 期限與異常監測員'},
        {'from': 'O03 期限與異常監測員', 'to': 'S02 方案比較分析員'},
        {'from': 'S02 方案比較分析員', 'to': '組裝每日營運摘要'},
        {'from': '組裝每日營運摘要', 'to': '寄送給負責人'},
        {'from': '錯誤觸發器', 'to': '錯誤通知'},
    ],
    'placeholders': [
        {'key': '【請填入：享洺營運資料 API 網址】', 'node': '收集營運資料', 'desc': '提供案件、收支、政府計畫與課程資料的 API 端點。目前享洺尚未接資料來源，這一欄未填流程不會有內容。'},
        {'key': 'OPS_API_CRED_ID', 'node': '收集營運資料', 'desc': '營運資料 API 的 Header Auth 憑證 ID。'},
        {'key': 'OPENAI_CRED_ID', 'node': '四個 Agent 節點', 'desc': 'OpenAI API 憑證 ID。若要改用與系統相同的 Anthropic，見設定清單的替換說明。'},
        {'key': '【請填入：寄件者信箱】', 'node': '寄送給負責人、錯誤通知', 'desc': '寄件者信箱。享洺的正式聯絡方式在知識庫 COMPANY-004 仍是待填狀態，這裡不代填。'},
        {'key': '【請填入：負責人收件信箱】', 'node': '寄送給負責人、錯誤通知', 'desc': '負責人收件信箱。Level 0 僅內部使用，收件人只能是負責人。'},
        {'key': 'SMTP_CRED_ID', 'node': '寄送給負責人、錯誤通知', 'desc': '寄信用 SMTP 憑證 ID。'},
    ],
}

wf, md = generate_workflow(spec)
out = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(out, 'workflow.json'), 'w', encoding='utf-8') as f:
    json.dump(wf, f, ensure_ascii=False, indent=2)
with open(os.path.join(out, '設定清單.md'), 'w', encoding='utf-8') as f:
    f.write(md)
print('節點', len(wf['nodes']), '連線', len(wf['connections']))
