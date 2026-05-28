/**
 * スプレッドシートを開いたときに独自メニューを追加する
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('UIテスト')
    .addItem('1. アラートを表示', 'testAlert')
    .addItem('2. 確認ダイアログを表示', 'testConfirm')
    .addItem('3. 入力ダイアログを表示', 'testPrompt')
    .addSeparator()
    .addItem('4. サイドバーを表示', 'showTestSidebar')
    .addItem('5. モーダルダイアログを表示', 'showTestModal')
    .addItem('6. モードレスダイアログを表示', 'showTestModelessDialog')
    .addSeparator()
    .addItem('7. トースト通知を表示', 'testToast')
    .addItem('8. セルUIをセットアップ', 'setupCellUiDemo')
    .addSeparator()
    .addItem('9. 選択セルの値を表示', 'showSelectedCellValue')
    .addToUi();
}

/**
 * 1. アラートダイアログ
 * ユーザーに情報を知らせるだけの小さなダイアログ
 */
function testAlert() {
  SpreadsheetApp.getUi().alert('これはアラートです。\n処理完了や注意表示に使えます。');
}

/**
 * 2. 確認ダイアログ
 * YES / NO の選択を受け取る
 */
function testConfirm() {
  const ui = SpreadsheetApp.getUi();

  const response = ui.alert(
    '確認ダイアログ',
    'この処理を実行しますか？',
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    ui.alert('「はい」が選ばれました。処理を続行します。');
  } else {
    ui.alert('「いいえ」が選ばれました。処理を中止します。');
  }
}

/**
 * 3. 入力ダイアログ
 * ユーザーから短い文字列を受け取る
 */
function testPrompt() {
  const ui = SpreadsheetApp.getUi();

  const response = ui.prompt(
    '入力ダイアログ',
    'あなたの名前を入力してください。',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() === ui.Button.OK) {
    const name = response.getResponseText();
    ui.alert(name + 'さん、こんにちは！');
  } else {
    ui.alert('入力はキャンセルされました。');
  }
}

/**
 * 4. サイドバー
 * 右側にHTMLベースの操作パネルを表示する
 */
function showTestSidebar() {
  const html = HtmlService
    .createHtmlOutput(getSidebarHtml())
    .setTitle('UIテスト サイドバー');

  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * サイドバー用HTML
 */
function getSidebarHtml() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 16px;
            line-height: 1.6;
          }
          h2 {
            margin-top: 0;
          }
          button {
            display: block;
            width: 100%;
            margin: 8px 0;
            padding: 8px;
            cursor: pointer;
          }
          .box {
            padding: 12px;
            background: #f1f3f4;
            border-radius: 8px;
            margin-top: 12px;
          }
        </style>
      </head>
      <body>
        <h2>サイドバーUI</h2>
        <p>これはスプレッドシート右側に出せる操作パネルです。</p>

        <button onclick="showToastFromSidebar()">トースト通知を出す</button>
        <button onclick="writeTextFromSidebar()">選択セルに文字を書く</button>
        <button onclick="getSelectedValue()">選択セルの値を取得</button>

        <div class="box">
          <strong>選択セルの値:</strong>
          <div id="selectedValue">まだ取得していません</div>
        </div>

        <script>
          function showToastFromSidebar() {
            google.script.run.testToast();
          }

          function writeTextFromSidebar() {
            google.script.run
              .withSuccessHandler(function() {
                alert('選択セルに文字を書きました。');
              })
              .writeTextToSelectedCell('サイドバーから入力しました');
          }

          function getSelectedValue() {
            google.script.run
              .withSuccessHandler(function(value) {
                document.getElementById('selectedValue').textContent = value;
              })
              .getSelectedCellValue();
          }
        </script>
      </body>
    </html>
  `;
}

/**
 * 5. モーダルダイアログ
 * 中央に表示され、閉じるまで基本的に操作を集中させるUI
 */
function showTestModal() {
  const html = HtmlService
    .createHtmlOutput(`
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_top">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              line-height: 1.6;
            }
            button {
              padding: 8px 16px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <h2>モーダルダイアログ</h2>
          <p>これは画面中央に出るHTMLダイアログです。</p>
          <p>メール送信前のプレビューや、重要な確認画面に向いています。</p>

          <button onclick="google.script.host.close()">閉じる</button>
        </body>
      </html>
    `)
    .setWidth(500)
    .setHeight(350);

  SpreadsheetApp.getUi().showModalDialog(html, 'モーダルUIテスト');
}

/**
 * 6. モードレスダイアログ
 * 中央付近に出るが、開いたままシート操作もできるUI
 */
function showTestModelessDialog() {
  const html = HtmlService
    .createHtmlOutput(`
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_top">
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              line-height: 1.6;
            }
            button {
              padding: 8px 16px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <h2>モードレスダイアログ</h2>
          <p>これは開いたままでも、シート側を操作しやすい補助UIです。</p>

          <button onclick="google.script.run.testToast()">トースト通知</button>
          <button onclick="google.script.host.close()">閉じる</button>
        </body>
      </html>
    `)
    .setWidth(400)
    .setHeight(300);

  SpreadsheetApp.getUi().showModelessDialog(html, 'モードレスUIテスト');
}

/**
 * 7. トースト通知
 * 右下に軽い通知を出す
 */
function testToast() {
  SpreadsheetApp.getActiveSpreadsheet().toast(
    'これはトースト通知です。',
    'UIテスト',
    5
  );
}

/**
 * 8. セルUIのセットアップ
 * チェックボックス、プルダウン、色付きステータスなどを作る
 */
function setupCellUiDemo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName('UIテスト');
  if (!sheet) {
    sheet = ss.insertSheet('UIテスト');
  }

  sheet.clear();

  const headers = [
    '送信対象',
    '名前',
    'メールアドレス',
    '種別',
    'ステータス',
    'メモ'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#d9ead3');

  const sampleRows = [
    [false, '山田太郎', 'yamada@example.com', '案内', '未処理', 'テストデータ1'],
    [true, '佐藤花子', 'sato@example.com', 'リマインド', '下書き済み', 'テストデータ2'],
    [false, '鈴木一郎', 'suzuki@example.com', 'お礼', '送信済み', 'テストデータ3']
  ];

  sheet.getRange(2, 1, sampleRows.length, headers.length).setValues(sampleRows);

  // A列にチェックボックスを設定
  sheet.getRange(2, 1, 100, 1).insertCheckboxes();

  // D列にプルダウンを設定
  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['案内', 'リマインド', 'お礼'], true)
    .setAllowInvalid(false)
    .build();

  sheet.getRange(2, 4, 100, 1).setDataValidation(typeRule);

  // E列にプルダウンを設定
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['未処理', '下書き済み', '送信済み', 'エラー'], true)
    .setAllowInvalid(false)
    .build();

  sheet.getRange(2, 5, 100, 1).setDataValidation(statusRule);

  // 条件付き書式
  const statusRange = sheet.getRange(2, 5, 100, 1);

  const rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('未処理')
      .setBackground('#fff2cc')
      .setRanges([statusRange])
      .build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('下書き済み')
      .setBackground('#cfe2f3')
      .setRanges([statusRange])
      .build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('送信済み')
      .setBackground('#d9ead3')
      .setRanges([statusRange])
      .build(),

    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('エラー')
      .setBackground('#f4cccc')
      .setRanges([statusRange])
      .build()
  ];

  sheet.setConditionalFormatRules(rules);

  // 見やすく整える
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
  sheet.getRange('A1:F1').createFilter();

  ss.setActiveSheet(sheet);

  SpreadsheetApp.getActiveSpreadsheet().toast(
    'セルUIデモを作成しました。',
    'UIテスト',
    5
  );
}

/**
 * 9. 選択セルの値をアラートで表示
 */
function showSelectedCellValue() {
  const value = getSelectedCellValue();
  SpreadsheetApp.getUi().alert('選択セルの値:\n' + value);
}

/**
 * 選択セルの値を取得
 * サイドバーからも呼び出す
 */
function getSelectedCellValue() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();

  if (!range) {
    return 'セルが選択されていません。';
  }

  const value = range.getDisplayValue();

  if (value === '') {
    return '空白セルです。';
  }

  return value;
}

/**
 * 選択セルに文字を書く
 * サイドバーから呼び出す
 */
function writeTextToSelectedCell(text) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();

  if (!range) {
    throw new Error('セルが選択されていません。');
  }

  range.setValue(text);
}