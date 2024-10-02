## アプリケーション概要

- Next.js で実装した Login 機能になります。
- 大まかな構成は以下、画像の内容になります。

![構成図](https://github.com/user-attachments/assets/4eb2f3a6-9a7a-4baf-b7a4-ef3bb4a6de02)

### 機能

- ログイン
- ログアウト
- 新規登録
  - Email 認証
    - 新規登録時には認証用の Email を登録時のアドレスに送信
- パスワード変更
  - Email 認証
    - パスワード変更時にも認証用の Email を登録アドレスに送信

### 詳細

- フレームワークについて
  - Next.js+TypeScript を使用しております。
- UI 構成について
  - Tailwind css
  - shadcn ui
- state の扱いについて
  - client 側だけで持つものは React の API（useState）で管理しております。
- DB とのデータ疎通について
  - server actions を利用し actions 内から ORM（Prisma）で MongoDB を操作して state を client に返却する構成にしております。（serverless）
- Mail 送信について
  - Resend を利用しております

### 確認環境

- [vercel](https://auth-next-cyan.vercel.app/)へ deploy 済み

※local 起動時、local build 起動時には問題ありませんでしたが vercel に deploy すると Auth.js の session が上手く取得できないため想定した挙動が行えない状態です。
（原因調査中）
