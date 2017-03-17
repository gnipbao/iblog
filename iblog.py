#!/usr/bin/python
# -*- coding: UTF-8 -*-
def fib(n):
    a, b = 0, 1
    while a < n:
      print a
      a, b = b, a+b        
fib(1000)