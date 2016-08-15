#!/usr/bin/env coffee
fs = require 'fs'
xml = require 'libxmljs'

x = fs.readFileSync 'test.n.xml'
module.exports = doc = xml.parseXmlString x

if require.main == module
  for q in process.argv[2..]
    for frag in doc.find(q)
      console.log frag.toString()
