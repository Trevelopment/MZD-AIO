#!/usr/bin/env node
import fs from 'fs';

export const fsTest = () => {
  const contents = fs.readFileSync('/jci/gui/apps/_aiotweaks/test.txt').toString();
  console.log(contents);
};
