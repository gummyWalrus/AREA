import 'dart:convert';
import 'package:area_front/sources/area.dart';
import 'package:area_front/sources/components/bottom_navigation.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:flutter/gestures.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:area_front/sources/crud/sign_up.dart';
import 'package:area_front/sources/components/theme.dart';
import 'package:area_front/sources/crud/update_password.dart';
import 'package:area_front/sources/components/gradient_text.dart';
import 'package:area_front/sources/components/elevated_button.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // Check user identity
  Future<void>? _fetchData() async {
    // Make request (post)
    final url = Uri.http(
        kIsWeb ? 'localhost:8080' : '10.0.2.2:8080', 'auth/login');
    final response = await http.post(url, body: {
      "email": _emailController.text,
      "password": _passwordController.text
    });
    // Check response
    if (response.statusCode == 201) {
      setState(() {
        final userData = jsonDecode(response.body);
        final String token = userData['token'];
        // print('Login Screen Token : $token');
        _setToken(token);
        const snackBar = SnackBar(content: Text('Login in'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => BottomNavigation(
                      token: token,
                      userData: userData,
                    )));
      });
    } else {
      setState(() {
        const snackBar = SnackBar(content: Text('No matching account found'));
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      });
    }
  }

  Future<void> _setToken(String newToken) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    // print('Login Token : "$newToken"');
    prefs.setString('token', newToken);
  }

  Future<void> _launchGithub() async {
    final url = Uri.http(
        kIsWeb ? 'localhost:8080' : '10.0.2.2:8080',
        '/auth/github');
    if (!await launchUrl(url)) {
      throw 'Could not launch url';
    }
  }

  Future<void> _launchGoogle() async {
    final url = Uri.http(
        kIsWeb ? 'localhost:8080' : '10.0.2.2:8080',
        '/auth/google');
    if (!await launchUrl(url)) {
      throw 'Could not launch url';
    }
  }

  Future<void> _launchDiscord() async {
    final url = Uri.http(
        kIsWeb ? 'localhost:8080' : '10.0.2.2:8080',
        '/auth/discord');
    if (!await launchUrl(url)) {
      throw 'Could not launch url';
    }
  }

  @override
  void dispose() {
    super.dispose();
    // Clean up the controller when the widget is disposed.
    _emailController.dispose();
    _passwordController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(gradient: themedGradient),
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: Colors.transparent,
        body: Column(children: [
          Expanded(
            child: Container(
              margin: const EdgeInsets.only(
                  top: 50.0, left: 25.0, bottom: 25.0, right: 25.0),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(30),
                color: Colors.white,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Container(
                      margin: const EdgeInsets.only(top: 15.0),
                      child: const GradientText(
                        'Login',
                        gradient: themedGradient,
                        style: TextStyle(
                            fontSize: 60, fontWeight: FontWeight.bold),
                      )),
                  Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        // Text field for login entry
                        Container(
                          margin: const EdgeInsets.all(15.0),
                          child: Column(
                            children: [
                              const Align(
                                  alignment: Alignment.topLeft,
                                  child: Text('Email')),
                              TextFormField(
                                controller: _emailController,
                                decoration: const InputDecoration(
                                    hintText: "exemple@email.com"),
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Invalid email ID';
                                  }
                                  return null;
                                },
                              ),
                            ],
                          ),
                        ),

                        // Text field for password entry
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
                                decoration:
                                    const InputDecoration(hintText: "password"),
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Invalid password';
                                  }
                                  return null;
                                },
                              ),
                            ],
                          ),
                        ),

                        // crud redirection (Update profile (password))
                        Container(
                          margin:
                              const EdgeInsets.only(top: 15.0, bottom: 15.0),
                          child: RichText(
                            text: TextSpan(children: [
                              TextSpan(
                                  text: 'Forgot password ?',
                                  style: const TextStyle(
                                    color: Colors.blue,
                                  ),
                                  recognizer: TapGestureRecognizer()
                                    ..onTap = () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) =>
                                                const UpdatePassword()),
                                      );
                                    }),
                            ]),
                          ),
                        ),

                        // Form validation button
                        Container(
                            width: 250,
                            margin: const EdgeInsets.all(5.0),
                            child: MyElevatedButton(
                              gradient: themedGradient,
                              borderRadius: BorderRadius.circular(30),
                              onPressed: () {
                                // Validate returns true if the form is valid, or false otherwise.
                                if (_formKey.currentState!.validate()) {
                                  // If the form is valid, send post request to _url
                                  _fetchData();
                                }
                              },
                              child: const Text('Login'),
                            )),

                        // crud redirection (create profile)
                        Container(
                          margin:
                              const EdgeInsets.only(top: 15.0, bottom: 15.0),
                          child: RichText(
                            text: TextSpan(children: [
                              const TextSpan(
                                text: 'Not a member ? ',
                                style: TextStyle(
                                  color: Colors.black,
                                ),
                              ),
                              TextSpan(
                                  text: 'SignUp',
                                  style: const TextStyle(
                                    color: Colors.blue,
                                  ),
                                  recognizer: TapGestureRecognizer()
                                    ..onTap = () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) =>
                                                const SignUp()),
                                      );
                                    }),
                            ]),
                          ),
                        ),
                        RichText(
                          text: const TextSpan(children: [
                            TextSpan(
                              text: 'Connect with other services',
                              style: TextStyle(
                                color: Colors.black,
                              ),
                            ),
                          ]),
                        ),
                        SizedBox(
                          height: 100,
                          width: 300,
                          child: ListView(
                            scrollDirection: Axis.horizontal,
                            children: [
                              MyElevatedButton(
                                  onPressed: _launchGithub,
                                  child: const Image(
                                    height: 50,
                                    width: 50,
                                    image: CachedNetworkImageProvider(
                                        'https://cdn-icons-png.flaticon.com/512/25/25231.png'),
                                  )),
                              MyElevatedButton(
                                  onPressed: _launchGoogle,
                                  child: const Image(
                                    height: 50,
                                    width: 50,
                                    image: CachedNetworkImageProvider(
                                        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png'),
                                  )),
                              MyElevatedButton(
                                  onPressed: _launchDiscord,
                                  child: const Image(
                                    height: 50,
                                    width: 50,
                                    image: CachedNetworkImageProvider(
                                        'https://is2-ssl.mzstatic.com/image/thumb/Purple112/v4/dd/a8/b8/dda8b8b7-1c81-33b3-e7b0-3b21044c21a5/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png'),
                                  ))
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ]),
      ),
    );
  }
}
