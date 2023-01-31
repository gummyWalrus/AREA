import 'dart:convert';
import 'package:area_front/main.dart';
import 'package:area_front/sources/components/bottom_navigation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async';
import 'package:uni_links/uni_links.dart';
import 'package:area_front/sources/login_screen.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'area.dart' as screen;
import 'dart:io' show Platform;
import 'dart:io' show Platform;

bool _initialURILinkHandled = false;
late Uri _initialURI;
Uri? _currentURI;
// Object? _err;
StreamSubscription? _streamSubscription;

class ConnectivityCheckRelay extends StatefulWidget {
  const ConnectivityCheckRelay({super.key});

  @override
  State<ConnectivityCheckRelay> createState() => _ConnectivityCheckRelayState();
}

class _ConnectivityCheckRelayState extends State<ConnectivityCheckRelay> {
  bool _tokenIsValid = false;
  String _token = "";
  Map<dynamic, dynamic> _userData = {};

  Future<String> _getToken() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = await _initURIHandler();
    // print('GET TOKEN : $token');
    // final String token = (prefs.getString('token') ?? '');
    if (token!.isNotEmpty)
      return token;
    else
      return (prefs.getString('token') ?? '');
  }

  Future<String?> _handleRedirect() async {
    _initialURILinkHandled = true;
    // 2
    // print('Calling init URI handler');
    try {
      // 3
      final initialURI = await getInitialUri();
      // 4
      if (initialURI != null) {
        // print("Initial URI received ${initialURI}");

        if (!mounted) {
          return '';
        }
        setState(() {
          _initialURI = initialURI;
          // print('PARAMS : ${initialURI.queryParameters}');
        });
        // print("Initial URI received before PARAMS ${_initialURI}");
        // print('PARAMS : ${_initialURI.queryParameters}');
        String str = _initialURI.toString();
        RegExp exp = RegExp(r'\?token=([^&]*)');
        RegExpMatch? match = exp.firstMatch(str);
        if (match != null && match.group(1) != null) {
          // print('TOKEN : ${match.group(1)}');
          return match.group(1);
        } else
          return '';
      } else {
        // debugPrint("Null Initial URI received");
        return '';
      }
    } on PlatformException {
      // 5
      debugPrint("Failed to receive initial uri");
      return '';
    } on FormatException catch (err) {
      // 6
      if (!mounted) {
        return '';
      }
      debugPrint('Malformed Initial URI received');
      // setState(() => _err = err);
      return '';
    }
  }

  Future<String?> _initURIHandler() async {
    // 1
    if (!_initialURILinkHandled) {
      return await _handleRedirect();
    } else
      return '';
  }

  Future<void> _askTokenValidity(String token) async {
    final url = Uri.http(
        kIsWeb ? 'localhost:8080' : '10.0.2.2:8080', '/user');
    // print('Relay Token : $token');
    final response = await http.get(url, headers: {'token': token});
    // print('Relay Status Code : ${response.statusCode}');
    // print('Relay : ${response.body}');
    response.statusCode == 200
        ? setState(() {
            _token = token;
            _userData = json.decode(response.body);
            _userData['token'] = _token;
            _tokenIsValid = true;
          })
        : setState(() => _tokenIsValid = false);
  }

  void _incomingLinkHandler() {
    // 1
    if (!kIsWeb) {
      // 2
      _streamSubscription = uriLinkStream.listen((Uri? uri) {
        if (!mounted) {
          return;
        }
        // debugPrint('Received URI: $uri');
        setState(() {
          _currentURI = uri;
          // _setToken(_currentURI!.queryParameters['token']!);
          // print('CURENT URI : $_currentURI');
          // _err = null;
        });
        // 3
      }, onError: (Object err) {
        if (!mounted) {
          return;
        }
        // debugPrint('Error occurred: $err');
        setState(() {
          _currentURI = null;
          if (err is FormatException) {
            // _err = err;
          } else {
            // _err = null;
          }
        });
      });
    }
  }

  Future<void> _setToken(String newToken) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setString('token', newToken);
  }

  @override
  void initState() {
    super.initState();
    _getToken().then((token) {
      // print('SETTING TOKEN : $token');
      _askTokenValidity(token);
      _setToken(token);
      _askTokenValidity(token);
    });
  }

  @override
  void dispose() {
    _streamSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: _tokenIsValid
          ? BottomNavigation(token: _token, userData: _userData)
          : const LoginScreen(),
    );
  }
}
