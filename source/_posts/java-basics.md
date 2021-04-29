---
title: Java Basics
date: 2015-03-22
tags: Java
---
The buffer pools corresponding to the basic types are as follows:

-boolean values ​​true and false -all byte values -short values ​​between -128 and 127 -int values ​​between -128 and 127 -char in the range \u0000 to \u007F

When using the packaging types corresponding to these basic types, you can directly use the objects in the buffer pool.


<!-- more -->


<!-- GFM-TOC -->
* [一, data type] (#一 data type)
 * [Package Type](#Package Type)
 * [Cache Pool](#Cache Pool)
* [二、String](#二string)
 * [Overview](#Overview)
 * [Immutable benefits] (#immutable benefits)
 * [String, StringBuffer and StringBuilder](#string,-stringbuffer-and-stringbuilder)
 * [String Pool](#string-pool)
 * [new String("abc")](#new-string"abc")
* [三、算](#三算)
 * [Parameter transfer](#Parameter transfer)
 * [float and double](#float-and-double)
 * [Implicit Type Conversion] (#Implicit Type Conversion)
 * [switch](#switch)
* [四. Inheritance] (#四 Inheritance)
 * [Access Authority](#Access Authority)
 * [Abstract Class and Interface](#Abstract Class and Interface)
 * [super](#super)
 * [Rewrite and reload](#Rewrite and reload)
* [五.Object general method] (#五object-common method)
 * [Overview](#Overview)
 * [equals()](#equals)
 * [hashCode()](#hashcode)
 * [toString()](#tostring)
 * [clone()](#clone)
* [六、Keywords] (#六Keywords)
 * [final](#final)
 * [static](#static)
* [七, reflection] (#七 Reflection)
* [八、Exception] (#八Exception)
* [九、generic](#九generic)
* [十、Notes] (#十Notes)
* [11. Features] (#11 Features)
 * [New features of each version of Java](#java-New features of each version)
 * [The difference between Java and C++](#java-and -c-difference)
 * [JRE or JDK](#jre-or-jdk)
* [Reference material](#Reference material)
<!-- GFM-TOC -->
# One, data type

## type of packaging

Eight basic types:

-boolean/1
-byte/8
-char/16
-short/16
-int/32
-float/32
-long/64
-double/64

The basic types have corresponding packaging types, and the assignment between the basic types and their corresponding packaging types is completed by automatic boxing and unboxing.

```java
Integer x = 2; // boxing
int y = x; // unboxing
```

## Cache Pool

The difference between new Integer(123) and Integer.valueOf(123) is:

-new Integer(123) will create a new object every time;
-Integer.valueOf(123) will use the object in the buffer pool, and multiple calls will get a reference to the same object.

```java
Integer x = new Integer(123);
Integer y = new Integer(123);
System.out.println(x == y); // false
Integer z = Integer.valueOf(123);
Integer k = Integer.valueOf(123);
System.out.println(z == k); // true
```

The implementation of the valueOf() method is relatively simple, that is, first determine whether the value is in the buffer pool, and if so, return the contents of the buffer pool directly.

```java
public static Integer valueOf(int i) {
 if (i &gt;= IntegerCache.low &amp;&amp; i &lt;= IntegerCache.high)
 return IntegerCache.cache[i + (-IntegerCache.low)];
 return new Integer(i);
}
```

In Java 8, the default size of the Integer buffer pool is -128\~127.

```java
static final int low = -128;
static final int high;
static final Integer cache[];

static {
 // high value may be configured by property
 int h = 127;
 String integerCacheHighPropValue =
 sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
 if (integerCacheHighPropValue != null) {
 try {
 int i = parseInt(integerCacheHighPropValue);
 i = Math.max(i, 127);
 // Maximum array size is Integer.MAX_VALUE
 h = Math.min(i, Integer.MAX_VALUE-(-low) -1);
 } catch( NumberFormatException nfe) {
 // If the property cannot be parsed into an int, ignore it.
 }
 }
 high = h;

 cache = new Integer[(high-low) + 1];
 int j = low;
 for(int k = 0; k &lt; cache.length; k++)
 cache[k] = new Integer(j++);

 // range [-128, 127] must be interned (JLS7 5.1.7)
 assert IntegerCache.high &gt;= 127;
}
```

The compiler will call the valueOf() method during the auto-boxing process, so multiple Integer instances are created using auto-boxing and have the same value, then the same object will be referenced.

```java
Integer m = 123;
Integer n = 123;
System.out.println(m == n); // true
```

The buffer pools corresponding to the basic types are as follows:

-boolean values ​​true and false
-all byte values
-short values ​​between -128 and 127
-int values ​​between -128 and 127
-char in the range \u0000 to \u007F

When using the packaging types corresponding to these basic types, you can directly use the objects in the buffer pool.

[StackOverflow: Differences between new Integer(123), Integer.valueOf(123) and just 123
](https://stackoverflow.com/questions/9030817/differences-between-new-integer123-integer-valueof123-and-just-123)

# Two, String

## Overview

String is declared as final, so it cannot be inherited.

The char array is used internally to store data. The array is declared as final, which means that after the value array is initialized, no other arrays can be referenced. And there is no method to change the value array inside String, so String can be guaranteed to be immutable.

```java
public final class String
 implements java.io.Serializable, Comparable
<string>
 , CharSequence {
 /** The value is used for character storage. */
 private final char value[];
```

## Immutable benefits

**1. The hash value can be cached** 

Because the hash value of String is often used, for example, String is used as the key of HashMap. The immutable feature can make the hash value immutable, so only one calculation is required.

**2. Need for String Pool** 

If a String object has already been created, then a reference will be taken from the String Pool. Only String is immutable, it is possible to use String Pool.
 <div align="center">
  <img src="http://ww1.sinaimg.cn/large/005RZJcZgy1gptwhtuwv5j30dy0600su.jpg" width=""/>
 </div>
 <br/>
 **3. Security** 

String is often used as a parameter, and String immutability can ensure that the parameter is immutable. For example, if String is variable as a network connection parameter, the String is changed during the network connection. The party that changes the String object thinks that it is connected to another host, but the actual situation is not necessarily the case.

**4. Thread safety** 

String immutability is inherently thread-safe and can be used safely in multiple threads.

[Program Creek: Why String is immutable in Java?](https://www.programcreek.com/2013/04/why-string-is-immutable-in-java/)

## String, StringBuffer and StringBuilder

**1. Variability** 

-String is immutable
-StringBuffer and StringBuilder are variable

**2. Thread safety** 

-String is immutable, so it is thread-safe
-StringBuilder is not thread safe
-StringBuffer is thread-safe and uses synchronized internally for synchronization

[StackOverflow: String, StringBuffer, and StringBuilder](https://stackoverflow.com/questions/2971315/string-stringbuffer-and-stringbuilder)

## String Pool

The String Pool stores all literal strings, which are determined at compile time. Not only that, you can also use String's intern() method to add strings to the String Pool during operation.

When a string calls the intern() method, if a string already exists in the String Pool and the string value is equal (using the equals() method to determine), then a reference to the string in the String Pool will be returned; otherwise, A new string will be added to the String Pool and a reference to this new string will be returned.

In the following example, s1 and s2 use the new String() method to create two different strings, while s3 and s4 obtain a string reference through the s1.intern() method. intern() first puts the string referenced by s1 into the String Pool, and then returns the string reference. Therefore, s3 and s4 refer to the same string.

```java
String s1 = new String("aaa");
String s2 = new String("aaa");
System.out.println(s1 == s2); // false
String s3 = s1.intern();
String s4 = s1.intern();
System.out.println(s3 == s4); // true
```

If the string is created in the form of "bbb" literal, the string will be automatically put into the String Pool.

```java
String s5 = "bbb";
String s6 = "bbb";
System.out.println(s5 == s6); // true
```

Before Java 7, String Pool was placed in the runtime constant pool, which belonged to the permanent generation. In Java 7, String Pool was moved to the heap. This is because the space of the permanent generation is limited, which will cause OutOfMemoryError in scenarios where a large number of strings are used.

-[StackOverflow: What is String interning?](https://stackoverflow.com/questions/10578984/what-is-string-interning)
-[In-depth analysis of String#intern](https://tech.meituan.com/in_depth_understanding_string_intern.html)

## new String("abc")

In this way, a total of two string objects will be created (provided that there is no "abc" string object in the String Pool).

-"abc" is a string literal, so a string object will be created in the String Pool at compile time, pointing to this "abc" string literal;
-Using new will create a string object in the heap.

Create a test class and use this method in its main method to create a string object.

```java
public class NewStringTest {
 public static void main(String[] args) {
 String s = new String("abc");
 }
}
```

Use javap -verbose to decompile and get the following:

```java
// ...
Constant pool:
// ...
 #2 = Class #18 // java/lang/String
 #3 = String #19 // abc
// ...
 #18 = Utf8 java/lang/String
 #19 = Utf8 abc
// ...

 public static void main(java.lang.String[]);
 descriptor: ([Ljava/lang/String;)V
 flags: ACC_PUBLIC, ACC_STATIC
 Code:
 stack=3, locals=2, args_size=1
 0: new #2 // class java/lang/String
 3: dup
 4: ldc #3 // String abc
 6: invokespecial #4 // Method java/lang/String."
 <init>
  ":(Ljava/lang/String;)V
 9: astore_1
// ...
```

In the Constant Pool, #19 stores the string literal "abc", #3 is the string object of the String Pool, and it points to the string literal #19. In the main method, line 0: uses new #2 to create a string object in the heap, and uses ldc #3 to use the string object in the String Pool as a parameter of the String constructor.

The following is the source code of the String constructor. You can see that when a string object is used as the constructor parameter of another string object, the contents of the value array will not be copied completely, but will all point to the same value array.

```java
public String(String original) {
 this.value = original.value;
 this.hash = original.hash;
}
```

# Three, operation

## Parameter passing

Java parameters are passed to the method in the form of value transfer, not by reference.

In the following code, the dog of Dog dog is a pointer, which stores the address of the object. When passing a parameter to a method, it essentially passes the address of the object to the formal parameter by value. Therefore, in the method, the pointers refer to other objects, then the two pointers point to completely different objects at this time, and when one party changes the content of the object pointed to, it has no effect on the other party.

```java
public class Dog {

 String name;

 Dog(String name) {
 this.name = name;
 }

 String getName() {
 return this.name;
 }

 void setName(String name) {
 this.name = name;
 }

 String getObjectAddress() {
 return super.toString();
 }
}
```

```java
public class PassByValueExample {
 public static void main(String[] args) {
 Dog dog = new Dog("A");
System.out.println(dog.getObjectAddress()); // Dog@4554617c
 func(dog);
System.out.println(dog.getObjectAddress()); // Dog@4554617c
 System.out.println(dog.getName()); // A
 }

 private static void func(Dog dog) {
System.out.println(dog.getObjectAddress()); // Dog@4554617c
 dog = new Dog("B");
System.out.println(dog.getObjectAddress()); // Dog@74a14482
 System.out.println(dog.getName()); // B
 }
}
```

If you change the field value of the object in the method, the field value of the original object will be changed, because the content pointed to by the same address is changed.

```java
class PassByValueExample {
 public static void main(String[] args) {
 Dog dog = new Dog("A");
 func(dog);
 System.out.println(dog.getName()); // B
 }

 private static void func(Dog dog) {
 dog.setName("B");
 }
}
```

[StackOverflow: Is Java “pass-by-reference” or “pass-by-value”?](https://stackoverflow.com/questions/40480/is-java-pass-by-reference-or-pass-by -value)

## float and double

Java cannot implicitly perform downcasting because it will reduce the accuracy.

1.1 The literal is a double type, and 1.1 cannot be directly assigned to a float variable, because this is a downcast.

```java
// float f = 1.1;
```

The 1.1f literal is the float type.

```java
float f = 1.1f;
```

## Implicit type conversion

Because the literal 1 is of the int type, it has higher precision than the short type, so the int type cannot be implicitly converted to the short type.

```java
short s1 = 1;
// s1 = s1 + 1;
```

But using += or ++ operator can perform implicit type conversion.

```java
s1 += 1;
// s1++;
```

The above statement is equivalent to downcasting the calculation result of s1 + 1:

```java
s1 = (short) (s1 + 1);
```

[StackOverflow: Why don't Java's +=, -=, *=, /= compound assignment operators require casting?](https://stackoverflow.com/questions/8710619/why-dont-javas-compound-assignment-operators -require-casting)

## switch

Starting from Java 7, String objects can be used in switch conditional judgment statements.

```java
String s = "a";
switch (s) {
 case "a":
 System.out.println("aaa");
 break;
 case "b":
 System.out.println("bbb");
 break;
}
```

Switch does not support long, because the original design intention of switch is to make equivalent judgments for only a few values. If the value is too complicated, then if is more appropriate.

```java
// long x = 111;
// switch (x) {// Incompatible types. Found:'long', required:'char, byte, short, int, Character, Byte, Short, Integer, String, or an enum'
// case 111:
// System.out.println(111);
// break;
// case 222:
// System.out.println(222);
// break;
//}
```

[StackOverflow: Why can't your switch statement data type be long, Java?](https://stackoverflow.com/questions/2676210/why-cant-your-switch-statement-data-type-be-long-java )

# Four, inheritance

## access permission

There are three access modifiers in Java: private, protected, and public. If no access modifier is added, it means package-level visibility.

You can add access modifiers to the class or members (fields and methods) in the class.

-Class visible means that other classes can use this class to create instance objects.
-Member visible means that other classes can use instance objects of this class to access the member;

Protected is used to modify members, which means that members are visible to subclasses in the inheritance system, but this access modifier has no meaning for classes.

A well-designed module hides all implementation details and clearly separates its API from its implementation. Modules only communicate through their APIs. A module does not need to know the internal workings of other modules. This concept is called information hiding or encapsulation. Therefore, access rights should be as far as possible to prevent each class or member from being accessed by the outside world.

If the method of the subclass overrides the method of the parent class, the access level of the method in the subclass is not allowed to be lower than the access level of the parent class. This is to ensure that the subclass instance can be used wherever the parent class instance can be used, that is, to ensure that the Richter substitution principle is met.

The field must not be public, because doing so will lose control of the modification behavior of this field, and the client can modify it at will. For example, in the following example, AccessExample has a public id field. If at a certain moment, we want to use int to store the id field, then we need to modify all the client code.

```java
public class AccessExample {
 public String id;
}
```

You can use public getter and setter methods to replace public fields, so that you can control the behavior of modifying the fields.


```java
public class AccessExample {

 private int id;

 public String getId() {
 return id + "";
 }

 public void setId(String id) {
 this.id = Integer.valueOf(id);
 }
}
```

But there are exceptions. If it is a package-level private class or a private nested class, then directly exposing the members will not have a particularly big impact.

```java
public class AccessWithInnerClassExample {

 private class InnerClass {
 int x;
 }

 private InnerClass innerClass;

 public AccessWithInnerClassExample() {
 innerClass = new InnerClass();
 }

 public int getValue() {
 return innerClass.x; // direct access
 }
}
```

## Abstract class and interface

**1. Abstract class** 

Both abstract classes and abstract methods are declared using the abstract keyword. Abstract classes generally contain abstract methods, and abstract methods must be located in abstract classes.

The biggest difference between abstract classes and ordinary classes is that abstract classes cannot be instantiated, and only subclasses can be instantiated by inheriting the abstract class.

```java
public abstract class AbstractClassExample {

 protected int x;
 private int y;

 public abstract void func1();

 public void func2() {
 System.out.println("func2");
 }
}
```

```java
public class AbstractExtendClassExample extends AbstractClassExample {
 @Override
 public void func1() {
 System.out.println("func1");
 }
}
```

```java
// AbstractClassExample ac1 = new AbstractClassExample(); //'AbstractClassExample' is abstract; cannot be instantiated
AbstractClassExample ac2 = new AbstractExtendClassExample();
ac2.func1();
```

**2. Interface** 

An interface is an extension of an abstract class. Before Java 8, it can be regarded as a completely abstract class, which means that it cannot have any method implementation.

Starting from Java 8, interfaces can also have default method implementations. This is because the maintenance cost of interfaces that do not support default methods is too high. Before Java 8, if an interface wanted to add a new method, then all classes that implemented the interface had to be modified.

The members (fields + methods) of the interface are all public by default, and are not allowed to be defined as private or protected.

The fields of the interface are static and final by default.

```java
public interface InterfaceExample {

 void func1();

 default void func2(){
 System.out.println("func2");
 }

 int x = 123;
 // int y; // Variable'y' might not have been initialized
 public int z = 0; // Modifier'public' is redundant for interface fields
 // private int k = 0; // Modifier'private' not allowed here
 // protected int l = 0; // Modifier'protected' not allowed here
 // private void fun3(); // Modifier'private' not allowed here
}
```

```java
public class InterfaceImplementExample implements InterfaceExample {
 @Override
 public void func1() {
 System.out.println("func1");
 }
}
```

```java
// InterfaceExample ie1 = new InterfaceExample(); //'InterfaceExample' is abstract; cannot be instantiated
InterfaceExample ie2 = new InterfaceImplementExample();
ie2.func1();
System.out.println(InterfaceExample.x);
```

**3. Comparison** 

-From a design perspective, an abstract class provides an IS-A relationship, so it must satisfy the Li substitution principle, that is, subclass objects must be able to replace all parent objects. The interface is more like a LIKE-A relationship, it only provides a way to implement the contract, and does not require an IS-A relationship between the interface and the class that implements the interface.
-From the point of view of use, a class can implement multiple interfaces, but cannot inherit multiple abstract classes.
-The fields of the interface can only be of static and final types, while the fields of the abstract class have no such restriction.
-The members of the interface can only be public, and the members of the abstract class can have multiple access rights.

**4. Use selection** 

Use interface:

-Need to make irrelevant classes implement a method, for example, irrelevant classes can implement the compareTo() method in the Compareable interface;
-Need to use multiple inheritance.

Use abstract classes:

-Need to share code among several related classes.
-Need to be able to control the access rights of inherited members, not all of them are public.
-Need to inherit non-static and non-constant fields.

In many cases, interfaces take precedence over abstract classes. Because the interface does not have strict class hierarchy requirements for abstract classes, you can flexibly add behavior to a class. And starting from Java 8, the interface can also have a default method implementation, making the cost of modifying the interface also very low.

-[In-depth understanding of abstract class and interface](https://www.ibm.com/developerworks/cn/java/l-javainterface-abstract/)
-[When to Use Abstract Class and Interface](https://dzone.com/articles/when-to-use-abstract-class-and-intreface)

## super

-Access to the constructor of the parent class: You can use the super() function to access the constructor of the parent class, thereby entrusting the parent class to complete some initialization work.
-Access the members of the parent class: If the child class overrides a method of the parent class, it can be achieved by using the super keyword to refer to the method of the parent class.

```java
public class SuperExample {

 protected int x;
 protected int y;

 public SuperExample(int x, int y) {
 this.x = x;
 this.y = y;
 }

 public void func() {
 System.out.println("SuperExample.func()");
 }
}
```

```java
public class SuperExtendExample extends SuperExample {

 private int z;

 public SuperExtendExample(int x, int y, int z) {
 super(x, y);
 this.z = z;
 }

 @Override
 public void func() {
 super.func();
 System.out.println("SuperExtendExample.func()");
 }
}
```

```java
SuperExample e = new SuperExtendExample(1, 2, 3);
e.func();
```

```html
SuperExample.func()
SuperExtendExample.func()
```

[Using the Keyword super](https://docs.oracle.com/javase/tutorial/java/IandI/super.html)

## Rewrite and reload

**1. Override** 

Existing in the inheritance system, it means that the child class implements a method that is exactly the same as the method declaration of the parent class.

In order to satisfy the principle of Li substitution, rewriting has the following two restrictions:

-The access authority of the subclass method must be greater than or equal to the parent class method;
-The return type of the subclass method must be the return type of the parent method or its subtype.

Using the @Override annotation, you can let the compiler help to check whether the above two restrictions are met.

**2. Overload** 

Existing in the same class means that a method has the same name as an existing method, but at least one parameter type, number, and order are different.

It should be noted that if the return value is different, everything else is the same, which is not considered an overload.

# Five, Object general method

## Overview

```java

public native int hashCode()

public boolean equals(Object obj)

protected native Object clone() throws CloneNotSupportedException

public String toString()

public final native Class
  <? >
  getClass()

protected void finalize() throws Throwable {}

public final native void notify()

public final native void notifyAll()

public final native void wait(long timeout) throws InterruptedException

public final void wait(long timeout, int nanos) throws InterruptedException

public final void wait() throws InterruptedException
```

## equals()

**1. Equivalence relationship** 

Ⅰ Reflexivity

```java
x.equals(x); // true
```

Ⅱ Symmetry

```java
x.equals(y) == y.equals(x); // true
```

Ⅲ Transitivity

```java
if (x.equals(y) &amp;&amp; y.equals(z))
 x.equals(z); // true;
```

Ⅳ Consistency

The result of calling equals() multiple times remains unchanged

```java
x.equals(y) == x.equals(y); // true
```

Ⅴ Comparison with null

Calling x.equals(null) on any object x that is not null will result in false

```java
x.equals(null); // false;
```

**2. Equivalence and equality** 

-For basic types, == determines whether two values ​​are equal. Basic types have no equals() method.
-For reference types, == judges whether two variables refer to the same object, and equals() judges whether the referenced objects are equivalent.

```java
Integer x = new Integer(1);
Integer y = new Integer(1);
System.out.println(x.equals(y)); // true
System.out.println(x == y); // false
```

**3. Implementation** 

-Check whether it is a reference to the same object, if it is a direct return true;
-Check whether it is the same type, if not, return false directly;
-Transform the Object object;
-Determine whether each key field is equal.

```java
public class EqualExample {

 private int x;
 private int y;
 private int z;

 public EqualExample(int x, int y, int z) {
 this.x = x;
 this.y = y;
 this.z = z;
 }

 @Override
 public boolean equals(Object o) {
 if (this == o) return true;
 if (o == null || getClass() != o.getClass()) return false;

 EqualExample that = (EqualExample) o;

 if (x != that.x) return false;
 if (y != that.y) return false;
 return z == that.z;
 }
}
```

## hashCode()

hashCode() returns the hash value, and equals() is used to determine whether two objects are equivalent. Two objects with equivalent hash values ​​must be the same, but two objects with the same hash value are not necessarily equivalent.

When overriding the equals() method, you should always overwrite the hashCode() method to ensure that the hash values ​​of the two equivalent objects are also equal.

In the following code, two equivalent objects are created and added to the HashSet. We want to treat these two objects as the same and only add one object to the collection, but because EqualExample does not implement the hasCode() method, the hash values ​​of these two objects are different, which eventually leads to the addition of two objects to the collection. Price object.

```java
EqualExample e1 = new EqualExample(1, 1, 1);
EqualExample e2 = new EqualExample(1, 1, 1);
System.out.println(e1.equals(e2)); // true
HashSet
  <equalexample>
   set = new HashSet&lt;&gt;();
set.add(e1);
set.add(e2);
System.out.println(set.size()); // 2
```

The ideal hash function should have uniformity, that is, unequal objects should be evenly distributed to all possible hash values. This requires the hash function to take all domain values ​​into consideration. Each field can be regarded as a certain digit of R system, and then form an integer of R system. R generally takes 31, because it is an odd prime number. If it is an even number, when the multiplication overflows, the information will be lost, because multiplying by 2 is equivalent to shifting one bit to the left.

Multiplying a number with 31 can be converted into shift and subtraction: `31*x == (x&lt;&lt;5)-x`, the compiler will automatically perform this optimization.

```java
@Override
public int hashCode() {
 int result = 17;
 result = 31 * result + x;
 result = 31 * result + y;
 result = 31 * result + z;
 return result;
}
```

## toString()

By default, the form ToStringExample@4554617c is returned , where the value after @ is the unsigned hexadecimal representation of the hash code.

```java
public class ToStringExample {

 private int number;

 public ToStringExample(int number) {
 this.number = number;
 }
}
```

```java
ToStringExample example = new ToStringExample(123);
System.out.println(example.toString());
```

```html
ToStringExample@4554617c
```

## clone()

**1. cloneable** 

Clone() is the protected method of Object. It is not public. If a class does not explicitly override clone(), other classes cannot directly call the clone() method of an instance of that class.

```java
public class CloneExample {
 private int a;
 private int b;
}
```

```java
CloneExample e1 = new CloneExample();
// CloneExample e2 = e1.clone(); //'clone()' has protected access in'java.lang.Object'
```

Rewrite clone() to get the following implementation:

```java
public class CloneExample {
 private int a;
 private int b;

 @Override
 public CloneExample clone() throws CloneNotSupportedException {
 return (CloneExample)super.clone();
 }
}
```

```java
CloneExample e1 = new CloneExample();
try {
 CloneExample e2 = e1.clone();
} catch (CloneNotSupportedException e) {
 e.printStackTrace();
}
```

```html
java.lang.CloneNotSupportedException: CloneExample
```

The CloneNotSupportedException is thrown above because CloneExample does not implement the Cloneable interface.

It should be noted that the clone() method is not a method of the Cloneable interface, but a protected method of Object. The Cloneable interface only stipulates that if a class does not implement the Cloneable interface and calls the clone() method, a CloneNotSupportedException will be thrown.

```java
public class CloneExample implements Cloneable {
 private int a;
 private int b;

 @Override
 public Object clone() throws CloneNotSupportedException {
 return super.clone();
 }
}
```

**2. Shallow copy** 

The reference types of the copied object and the original object refer to the same object.

```java
public class ShallowCloneExample implements Cloneable {

 private int[] arr;

 public ShallowCloneExample() {
 arr = new int[10];
 for (int i = 0; i &lt; arr.length; i++) {
 arr[i] = i;
 }
 }

 public void set(int index, int value) {
 arr[index] = value;
 }

 public int get(int index) {
 return arr[index];
 }

 @Override
 protected ShallowCloneExample clone() throws CloneNotSupportedException {
 return (ShallowCloneExample) super.clone();
 }
}
```

```java
ShallowCloneExample e1 = new ShallowCloneExample();
ShallowCloneExample e2 = null;
try {
 e2 = e1.clone();
} catch (CloneNotSupportedException e) {
 e.printStackTrace();
}
e1.set(2, 222);
System.out.println(e2.get(2)); // 222
```

**3. Deep copy** 

The reference types of the copied object and the original object refer to different objects.

```java
public class DeepCloneExample implements Cloneable {

 private int[] arr;

 public DeepCloneExample() {
 arr = new int[10];
 for (int i = 0; i &lt; arr.length; i++) {
 arr[i] = i;
 }
 }

 public void set(int index, int value) {
 arr[index] = value;
 }

 public int get(int index) {
 return arr[index];
 }

 @Override
 protected DeepCloneExample clone() throws CloneNotSupportedException {
 DeepCloneExample result = (DeepCloneExample) super.clone();
 result.arr = new int[arr.length];
 for (int i = 0; i &lt; arr.length; i++) {
 result.arr[i] = arr[i];
 }
 return result;
 }
}
```

```java
DeepCloneExample e1 = new DeepCloneExample();
DeepCloneExample e2 = null;
try {
 e2 = e1.clone();
} catch (CloneNotSupportedException e) {
 e.printStackTrace();
}
e1.set(2, 222);
System.out.println(e2.get(2)); // 2
```

**4. Alternatives to clone()** 

Using the clone() method to copy an object is complicated and risky, it throws an exception, and also requires type conversion. As mentioned in the Effective Java book, it is best not to use clone(), you can use the copy constructor or copy factory to copy an object.

```java
public class CloneConstructorExample {

 private int[] arr;

 public CloneConstructorExample() {
 arr = new int[10];
 for (int i = 0; i &lt; arr.length; i++) {
 arr[i] = i;
 }
 }

 public CloneConstructorExample(CloneConstructorExample original) {
 arr = new int[original.arr.length];
 for (int i = 0; i &lt; original.arr.length; i++) {
 arr[i] = original.arr[i];
 }
 }

 public void set(int index, int value) {
 arr[index] = value;
 }

 public int get(int index) {
 return arr[index];
 }
}
```

```java
CloneConstructorExample e1 = new CloneConstructorExample();
CloneConstructorExample e2 = new CloneConstructorExample(e1);
e1.set(2, 222);
System.out.println(e2.get(2)); // 2
```

# Six, keywords

## final

**1. Data** 

The declared data is a constant, which can be a compile-time constant or a constant that cannot be changed after being initialized at runtime.

-For basic types, final keeps the value unchanged;
-For reference types, final makes the reference unchanged, so other objects cannot be referenced, but the referenced object itself can be modified.

```java
final int x = 1;
// x = 2; // cannot assign value to final variable'x'
final A y = new A();
ya = 1;
```

**2. Method** 

The declaration method cannot be overridden by subclasses.

The private method is implicitly designated as final. If the method defined in the subclass has the same signature as a private method in the base class, then the method of the subclass is not overriding the base class method, but is defined in the subclass A new approach.

**3. Class** 

The declared class is not allowed to be inherited.

## static

**1. Static variables** 

-Static variable: also known as class variable, which means that this variable belongs to the class. All instances of the class share the static variable, which can be accessed directly through the class name. There is only one copy of static variables in memory.
-Instance variable: Every time an instance is created, an instance variable will be generated, and it will live and die with the instance.

```java
public class A {

 private int x; // instance variable
 private static int y; // static variable

 public static void main(String[] args) {
 // int x = Ax; // Non-static field'x' cannot be referenced from a static context
 A a = new A();
 int x = ax;
 int y = Ay;
 }
}
```

**2. Static method** 

The static method exists when the class is loaded, and it does not depend on any instance. Therefore, a static method must have an implementation, which means that it cannot be an abstract method.

```java
public abstract class A {
 public static void func1(){
 }
 // public abstract static void func2(); // Illegal combination of modifiers:'abstract' and'static'
}
```

Only the static fields and static methods of the belonging class can be accessed, and the this and super keywords cannot be included in the method.

```java
public class A {

 private static int x;
 private int y;

 public static void func1(){
 int a = x;
 // int b = y; // Non-static field'y' cannot be referenced from a static context
 // int b = this.y; //'A.this' cannot be referenced from a static context
 }
}
```

**3. Static statement block** 

The static statement block runs once when the class is initialized.

```java
public class A {
 static {
 System.out.println("123");
 }

 public static void main(String[] args) {
 A a1 = new A();
 A a2 = new A();
 }
}
```

```html
123
```

**4. Static inner class** 

Non-static inner classes depend on instances of outer classes, while static inner classes do not.

```java
public class OuterClass {

 class InnerClass {
 }

 static class StaticInnerClass {
 }

 public static void main(String[] args) {
 // InnerClass innerClass = new InnerClass(); //'OuterClass.this' cannot be referenced from a static context
 OuterClass outerClass = new OuterClass();
 InnerClass innerClass = outerClass.new InnerClass();
 StaticInnerClass staticInnerClass = new StaticInnerClass();
 }
}
```

The static inner class cannot access the non-static variables and methods of the outer class.

**5. Static guide package** 

When using static variables and methods, there is no need to specify the ClassName, thus simplifying the code, but the readability is greatly reduced.

```java
import static com.xxx.ClassName.*
```

**6. Initialization sequence** 

Static variables and static statement blocks take precedence over instance variables and ordinary statement blocks. The initialization order of static variables and static statement blocks depends on their order in the code.

```java
public static String staticField = "Static Variable";
```

```java
static {
 System.out.println("Static statement block");
}
```

```java
public String field = "Instance Variable";
```

```java
{
 System.out.println("Normal statement block");
}
```

The last is the initialization of the constructor.

```java
public InitialOrderTest() {
 System.out.println("Constructor");
}
```

In the case of inheritance, the initialization sequence is:

-Parent class (static variable, static statement block)
-Subclass (static variable, static statement block)
-Parent class (instance variables, ordinary statement blocks)
-Parent class (constructor)
-Subclass (instance variable, ordinary statement block)
-Subclass (constructor)


# Seven, reflection

Each class has a **Class** object, which contains information about the class. When a new class is compiled, a .class file with the same name is generated, and the content of the file holds the Class object.

Class loading is equivalent to the loading of Class objects, and the class is dynamically loaded into the JVM when it is used for the first time. You can also use `Class.forName("com.mysql.jdbc.Driver")` to control the loading of the class. This method returns a Class object.

Reflection can provide runtime class information, and this class can be loaded at runtime, even if the class does not exist at compile time.

Class and java.lang.reflect together provide support for reflection. The java.lang.reflect class library mainly contains the following three classes:

-**Field**: You can use the get() and set() methods to read and modify the fields associated with the Field object;
-**Method**: You can use the invoke() method to call the method associated with the Method object;
-**Constructor**: Constructor can be used to create new objects.

**Advantages of Using Reflection:** 

-**Extensibility Features**: An application may make use of external, user-defined classes by creating instances of extensibility objects using their fully-qualified names.
-**Class Browsers and Visual Development Environments**: A class browser needs to be able to enumerate the members of classes. Visual development environments can benefit from making use of type information available in reflection to aid the developer in writing correct code.
-**Debuggers and Test Tools**: Debuggers need to be able to examine private members on classes. Test harnesses can make use of reflection to systematically call a discoverable set APIs defined on a class, to insure a high level of code coverage in a test suite.

**Drawbacks of Reflection:** 

Reflection is powerful, but should not be used indiscriminately. If it is possible to perform an operation without using reflection, then it is preferable to avoid using it. The following concerns should be kept in mind when accessing code via reflection.

-**Performance Overhead**: Because reflection involves types that are dynamically resolved, certain Java virtual machine optimizations can not be performed. Consequently, reflective operations have slower performance than their non-reflective counterparts, and should be avoided in sections of code which are called frequently in performance-sensitive applications.
-**Security Restrictions**: Reflection requires a runtime permission which may not be present when running under a security manager. This is in an important consideration for code which has to run in a restricted security context, such as in an Applet.
-**Exposure of Internals** :Since reflection allows code to perform operations that would be illegal in non-reflective code, such as accessing private fields and methods, the use of reflection can result in unexpected side-effects, which may render code dysfunctional and may destroy portability. Reflective code breaks abstractions and therefore may change behavior with upgrades of the platform.


-[Trail: The Reflection API](https://docs.oracle.com/javase/tutorial/reflect/index.html)
-[In-depth analysis of Java reflection (1)-basics](http://www.sczyh30.com/posts/Java/java-reflection-1/)

# Eight, abnormal

Throwable can be used to represent any class that can be thrown as an exception. There are two types: **Error** and **Exception**. Error is used to indicate errors that the JVM cannot handle. Exception is divided into two types:

-**Checked exception**: You need to use try...catch... statements to capture and process, and you can recover from the exception;
-**Unchecked Exception**: It is a program runtime error. For example, division by 0 will cause Arithmetic Exception, and the program crashes and cannot be recovered at this time.
   <div align="center">
    <img src="http://ww1.sinaimg.cn/large/005RZJcZgy1gptwhvbr4oj33ky1zj12j.jpg" width="600"/>
   </div>
   <br/>
   -[Exception Handling for Getting Started with Java](https://www.tianmaying.com/tutorial/Java-Exception)
-[Java Abnormal Interview Questions and Answers-Part 1](http://www.importnew.com/7383.html)

# Nine, generic

```java
public class Box
   <t>
    {
 // T stands for "Type"
 private T t;
 public void set(T t) {this.t = t;}
 public T get() {return t;}
}
```

-[Detailed Explanation of Java Generics](http://www.importnew.com/24029.html)
-[10 Java generic interview questions](https://cloud.tencent.com/developer/article/1033693)

# 十、Comment

Java annotations are some meta-information attached to the code, which are used to parse and use some tools during compilation and runtime, and play the function of explanation and configuration. Annotations will not and cannot affect the actual logic of the code, but only play a supporting role.

[Annotation Annotation realization principle and custom annotation example](https://www.cnblogs.com/acm-bingzi/p/javaAnnotation.html)

# XI. Features

## New features in each version of Java

**New highlights in Java SE 8** 

1. Lambda Expressions
2. Pipelines and Streams
3. Date and Time API
4. Default Methods
5. Type Annotations
6. Nashhorn JavaScript Engine
7. Concurrent Accumulators
8. Parallel operations
9. PermGen Error Removed

**New highlights in Java SE 7** 

1. Strings in Switch Statement
2. Type Inference for Generic Instance Creation
3. Multiple Exception Handling
4. Support for Dynamic Languages
5. Try with Resources
6. Java nio Package
7. Binary Literals, Underscore in literals
8. Diamond Syntax

-[Difference between Java 1.8 and Java 1.7?](http://www.selfgrowth.com/articles/difference-between-java-18-and-java-17)
-[Java 8 Features](http://www.importnew.com/19345.html)

## The difference between Java and C++

-Java is a pure object-oriented language. All objects inherit from java.lang.Object. C++ supports both object-oriented and process-oriented for compatibility with C.
-Java implements cross-platform features through a virtual machine, but C++ depends on a specific platform.
-Java has no pointers, and its references can be understood as safe pointers, while C++ has the same pointers as C.
-Java supports automatic garbage collection, while C++ requires manual collection.
-Java does not support multiple inheritance and can only achieve the same goal by implementing multiple interfaces, while C++ supports multiple inheritance.
-Java does not support operator overloading. Although it is possible to perform addition operations on two String objects, this is an operation supported by the language, not operator overloading, but C++ does.
-Java's goto is a reserved word, but it is not available. C++ can use goto.
-Java does not support conditional compilation. C++ uses #ifdef #ifndef and other preprocessing commands to achieve conditional compilation.

[What are the main differences between Java and C++?](http://cs-fundamentals.com/tech-interview/java/differences-between-java-and-cpp.php)

## JRE or JDK

-JRE is the JVM program, Java application need to run on JRE.
-JDK is a superset of JRE, JRE + tools for developing java programs. eg, it provides the compiler "javac"

# Reference

-Eckel B. Java programming thought [M]. Machinery Industry Press, 2002.
-Bloch J. Effective java[M]. Addison-Wesley Professional, 2017.
   </t>
  </equalexample>
 </init>
</string>
