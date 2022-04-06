---
layout: post
title: 'Test Structuring in C#'
tags:
  - post
  - programming
---

Im changing my opinion on test structuring in C#. I've always thought that structuring tests using a class hierarchy made sense because it provided a lot of benefits:

- Easy to share private objects between parent and child tests
- Setups can be inherited, extended
- Test structure in most outputs is pretty readable `ParentObjectTests+ChildTestCase+AndQualifier+AndQualifier+TestCaseWithOutcome`

But I've really been noticing one really weighty downside: the test code is hard to read and follow. Refactoring tests happens pretty often during a project and tests serve in a lot of cases as the documentation of the intent of the code so they really should be easy to read and understand to make those changes as quick and effortless as possible.

Using a nested structure creates a lot of tight coupling between test cases, usually refactoring a test case involves changing the setup for the test(s) I was changing but it also had changes that rippled up into the parent class. Also, creating a mapping of my test case scenarios to class structure created a lot of boilerplate code that would need to be refactored when cases changed, even slightly.
Let's assume we have a Contact state action and we have a test to make sure that when we enter that state it plays the right animation.

Given the test class structure I would lay it out like the following (forgive the abbreviated syntax):

```csharp
public class ContactActionTests {
  public class GivenEnteringAction : ContactActionTests {
    public class AndContactAnimationExists : GivenEnteringAction {
      public void ItShouldPlayTheAnimation()
```

But what if there are other scenarios where it should play the contact animation?

Well those get their own classes too. And pretty soon we might have a class hierarchy that is really hard to read through.

```csharp
public class ContactActionTests {
  public class GivenEnteringAction : ContactActionTests {
    public class AndContactAnimationExists : GivenEnteringAction {
      public void ItShouldPlayTheAnimation();
    public class AndContactAnimationDoesNotExist : GivenEnteringAction {
      public void ItShouldNotPlayTheAnimation();
  public class GivenExecutingAction : ContatctActionTests {
    public class AndContactAnimationExists : GivenExecutingAction {
      public class AndAnimationIsNotPlaying : AndContactAnimationExists {
        public void ItShouldPlayTheAnimation();
```

Can you separate the different test cases there?

What about which `ItShouldPlayTheAnimation()` is under which scenario? Keep in mind this is missing a lot of the syntax for proper c#, and there are no mocks, no setups, nothing but the class and method names and it's already becoming hard to read.

Switching this up to a more standard `Given_And_When_Then/It()` method structure at the root of the parent class things become much cleaner.

```csharp
public class ContactActionTests {
  public void GivenEnteringAction_AndContactAnimationExists_ItShouldPlayTheAnimation();
  public void GivenEnteringAction_AndContactAnimationDoesNotExist_ItShouldNotPlayTheAnimation();
  public void GivenExecutingAction_AndContatAnimationExists_AndAnimationIsNotPlaying_ItShouldPlayTheAnimation();
```

In my opinion, this makes it much easier to see that there are only three test cases and what scenarios they cover.

As for the other "benefits" of the class hierarchy test structure? Well they aren't really benefits. Sure setups can be inherited and extended but this often lead to brittle setups or worse confusing test cases where you had to scan the entire class hierarchy to figure out what mocks were active. The benefit of sharing private members is irrelevant in a single class structure and the test readability is much better in the code and the UI is pretty much the same.
