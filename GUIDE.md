# Guide

DISINI MENGGUNAKAN PACKAGE MANAGER JANGAN PAKE NPM

## Standard
  1. Penamaan class menggunakan PascalCase singular
  2. Indentasi menggunakan Spasi sebanyak 2 spasi, bisa di set dulu vscode nya atau menggunakan prettier on save
  3. Penamaan file menggunakan lowercase, apabila 2 kata bisa disambung dengan - (dash). exmpl -> user-session.module.ts
  4. Disetiap akhir file tambahkan satu baris kosong
  5. Wajib Titik Koma
  6. Kalau ada string yg sifatnya secret contohnya string untuk sign jwt, round untuk hash bcrypt, bisa disimpen di .env aja, jangan lupa tambahin juga di .env.example

## Migration
  1. Generate Migration -> yarn typeorm migration:create -n nama-migration
  2. Build/Watch dulu biar migrationnya bisa jalan -> yarn build / yarn start:dev

## Entity
  1. Penamaan file entity nama-class.entity.ts
  2. Penamaan class wajib singular ditambahin entity. exmpl -> UserEntity
  3. Kalau bisa menggunakan BaseEntity yg ada di folder entities. exmpl -> class UserEntity extends BaseEntity
  4. Penamaan property menggunakan camelCase, tapi di decorator @Column di set namanya sesuai dg di database yang menggunakan snake_case

## Exception
  1. Menggunakan throw exception dari file utils/exception.ts
  2. Kalau exception yang belum digunakan belum ada bisa ditambahkan sendiri

Supaya code nya lebih clean dan rapi, jadinya ga nambah kerjaan yg ngereview.
