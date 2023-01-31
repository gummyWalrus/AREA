import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'package:area_front/sources/login_screen.dart';
import 'package:area_front/sources/components/theme.dart';
import 'package:area_front/sources/components/gradient_text.dart';
import 'package:area_front/sources/components/elevated_button.dart';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class Profile extends StatefulWidget {
  const Profile({required this.userData, super.key});

  final Map<dynamic, dynamic> userData;

  @override
  State<Profile> createState() => _ProfileState();
}

class _ProfileState extends State<Profile> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _firstnameController = TextEditingController();
  final TextEditingController _lastnameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  Future<void> _modifyProfileInformation() async {
    final url = Uri.https(
        'area-halouf.herokuapp.com', '/user/${widget.userData['_id']}');
    final response = await http.put(url, headers: <String, String>{
      'token': widget.userData['token']
    }, body: {
      "email": _emailController.text,
      "firstname": _firstnameController.text,
      "lastname": _lastnameController.text,
      "password": _passwordController.text
    });
    print(response.body);
    if (response.statusCode == 200) {
    } else {
      setState(() {
        const snackBar =
            SnackBar(content: Text('Could not modify profile informations'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      });
    }
  }

  Future<void> _disconnect() async {
    final url = Uri.http(
        kIsWeb ? 'localhost:8080' : '10.0.2.2:8080',
        'user/disconnect');
    final response = await http.post(url, headers: {
      'token': widget.userData['token'],
    });
    print(response.body);
    if (response.statusCode == 200) {
      setState(() {
        const snackBar = SnackBar(content: Text('Disconnecting'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
        Navigator.push(context,
            MaterialPageRoute(builder: (context) => const LoginScreen()));
      });
    } else {
      setState(() {
        const snackBar = SnackBar(content: Text('Could not disconnect'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      });
    }
  }

  Future<void> _delete() async {
    final url = Uri.https(
        'area-halouf.herokuapp.com', 'user/${widget.userData['_id']}');
    final response = await http.delete(url, headers: {
      'token': widget.userData['token'],
    });
    print(response.body);
    if (response.statusCode == 200) {
      setState(() {
        const snackBar = SnackBar(content: Text('Profile deleted'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
        Navigator.push(context,
            MaterialPageRoute(builder: (context) => const LoginScreen()));
      });
    } else {
      setState(() {
        const snackBar = SnackBar(content: Text('Could not delete profile'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      });
    }
  }

  @override
  void dispose() {
    super.dispose();
    _firstnameController.dispose();
    _lastnameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: const BoxDecoration(gradient: themedGradient),
        child: Scaffold(
            resizeToAvoidBottomInset: false,
            appBar: AppBar(
              backgroundColor: Colors.white,
              centerTitle: true,
              shadowColor: Theme.of(context).colorScheme.shadow,
              title: const GradientText(
                'Profile',
                gradient: themedGradient,
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
              ),
            ),
            backgroundColor: Colors.transparent,
            body: ListView(children: [
              Container(
                margin: const EdgeInsets.only(
                    top: 50.0, left: 25.0, bottom: 25.0, right: 25.0),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(30),
                  color: Colors.white,
                ),
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        margin: const EdgeInsets.all(30.0),
                        child: const CircleAvatar(
                          backgroundColor: Colors.black,
                          foregroundColor: Colors.white,
                          radius: 50.0,
                          child: Icon(size: 34, Icons.perm_identity),
                        ),
                      ),
                      Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            Container(
                              margin: const EdgeInsets.all(15.0),
                              child: Column(
                                children: [
                                  const Align(
                                      alignment: Alignment.topLeft,
                                      child: Text('Name')),
                                  TextFormField(
                                    controller: _firstnameController,
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Invalid name';
                                      }
                                      return null;
                                    },
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              margin: const EdgeInsets.all(15.0),
                              child: Column(
                                children: [
                                  const Align(
                                      alignment: Alignment.topLeft,
                                      child: Text('Lastname')),
                                  TextFormField(
                                    controller: _lastnameController,
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Invalid lastname';
                                      }
                                      return null;
                                    },
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              margin: const EdgeInsets.all(15.0),
                              child: Column(
                                children: [
                                  const Align(
                                      alignment: Alignment.topLeft,
                                      child: Text('Email')),
                                  TextFormField(
                                    controller: _emailController,
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Invalid email';
                                      }
                                      return null;
                                    },
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              margin: const EdgeInsets.all(15.0),
                              child: Column(
                                children: [
                                  const Align(
                                      alignment: Alignment.topLeft,
                                      child: Text('Password')),
                                  TextFormField(
                                    controller: _passwordController,
                                    obscureText: true,
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Invalid lastname';
                                      }
                                      return null;
                                    },
                                  ),
                                ],
                              ),
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                Container(
                                    margin: const EdgeInsets.all(15.0),
                                    child: MyElevatedButton(
                                      gradient: themedGradient,
                                      borderRadius: BorderRadius.circular(30),
                                      onPressed: () {
                                        if (_formKey.currentState!.validate()) {
                                          _modifyProfileInformation();
                                        }
                                      },
                                      child: const Text(
                                          'Modify Profile Informations'),
                                    )),
                                Container(
                                    margin: const EdgeInsets.all(15.0),
                                    child: MyElevatedButton(
                                      gradient: themedGradient,
                                      borderRadius: BorderRadius.circular(30),
                                      onPressed: _disconnect,
                                      child: const Text('Disconnect'),
                                    )),
                                Container(
                                    margin: const EdgeInsets.all(15.0),
                                    child: MyElevatedButton(
                                      gradient: themedGradient,
                                      borderRadius: BorderRadius.circular(30),
                                      onPressed: _delete,
                                      child: const Text('Delete'),
                                    )),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ]),
              )
            ])));
  }
}
