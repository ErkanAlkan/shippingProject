PGDMP      #                |           shipping_db    16.3    16.3     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16398    shipping_db    DATABASE     �   CREATE DATABASE shipping_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE shipping_db;
                postgres    false                        2615    27562    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            �           0    0    SCHEMA public    COMMENT         COMMENT ON SCHEMA public IS '';
                   postgres    false    5            �           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                   postgres    false    5            �            1259    27563    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap    postgres    false    5            �            1259    27574    connector_connector    TABLE     ^  CREATE TABLE public.connector_connector (
    longitude numeric(10,7),
    latitude numeric(10,7),
    cumulative_dist numeric(10,2),
    path_len numeric(10,2),
    point_type character(1),
    move_time integer NOT NULL,
    origin character varying(255) NOT NULL,
    destination character varying(255) NOT NULL,
    partial_dist numeric(10,2)
);
 '   DROP TABLE public.connector_connector;
       public         heap    postgres    false    5            �            1259    27581    origin_connector    TABLE     [  CREATE TABLE public.origin_connector (
    longitude numeric(10,7),
    latitude numeric(10,7),
    cumulative_dist numeric(10,2),
    path_len numeric(10,2),
    point_type character(1),
    move_time integer NOT NULL,
    destination character varying(255) NOT NULL,
    partial_dist numeric(10,2),
    origin character varying(255) NOT NULL
);
 $   DROP TABLE public.origin_connector;
       public         heap    postgres    false    5            �            1259    27588    origin_destination    TABLE     ]  CREATE TABLE public.origin_destination (
    longitude numeric(10,7),
    latitude numeric(10,7),
    cumulative_dist numeric(10,2),
    path_len numeric(10,2),
    point_type character(1),
    move_time integer NOT NULL,
    partial_dist numeric(10,2),
    origin character varying(255) NOT NULL,
    destination character varying(255) NOT NULL
);
 &   DROP TABLE public.origin_destination;
       public         heap    postgres    false    5            �          0    27563    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public          postgres    false    215   �       �          0    27574    connector_connector 
   TABLE DATA           �   COPY public.connector_connector (longitude, latitude, cumulative_dist, path_len, point_type, move_time, origin, destination, partial_dist) FROM stdin;
    public          postgres    false    216   �       �          0    27581    origin_connector 
   TABLE DATA           �   COPY public.origin_connector (longitude, latitude, cumulative_dist, path_len, point_type, move_time, destination, partial_dist, origin) FROM stdin;
    public          postgres    false    217   �       �          0    27588    origin_destination 
   TABLE DATA           �   COPY public.origin_destination (longitude, latitude, cumulative_dist, path_len, point_type, move_time, partial_dist, origin, destination) FROM stdin;
    public          postgres    false    218   /       (           2606    27571 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public            postgres    false    215            *           2606    27580 ,   connector_connector connector_connector_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.connector_connector
    ADD CONSTRAINT connector_connector_pkey PRIMARY KEY (move_time, origin, destination);
 V   ALTER TABLE ONLY public.connector_connector DROP CONSTRAINT connector_connector_pkey;
       public            postgres    false    216    216    216            ,           2606    27587 &   origin_connector origin_connector_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.origin_connector
    ADD CONSTRAINT origin_connector_pkey PRIMARY KEY (destination, origin, move_time);
 P   ALTER TABLE ONLY public.origin_connector DROP CONSTRAINT origin_connector_pkey;
       public            postgres    false    217    217    217            .           2606    27594 *   origin_destination origin_destination_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public.origin_destination
    ADD CONSTRAINT origin_destination_pkey PRIMARY KEY (destination, origin, move_time);
 T   ALTER TABLE ONLY public.origin_destination DROP CONSTRAINT origin_destination_pkey;
       public            postgres    false    218    218    218            �   �   x�m�K
�0�ᱮ��r��\����8h��S��p��ЍSq0@�%�c	�-q��kM׌*���%kI8h��K[�U%�������"+��c��I8|��(0�I�@�"1� ����������}}���~�A&���~��}��90�      �     x�u�Mn�0���]L���]�$Y6�-
���$'�tc�'>�=��������6�
�gR���������������xY��ܤ����{E�_���8��\y���NI7��i
�r�@��	h��7�T�0�!����
A���LK�V�����>Z��h��'j����.KE�^q|���όJ�X�@��ІY�1IJZh�ѡ]u���R�ft���|=�.� �ؑ�]�L� ^Ϸ���g6�K�#����@���t��kE��Ν���O��-<m|ʤV���4s�Qgw�ܺ�FK%p,�@a��<����.�lxwV;�1oV�1���Y��FGOv�����{f�%fsf˹��>9�L�P��|`���&�-���F.��9OӓP�Bƫ���~�\ %Zu��́�k.��Q,|ۭ��S��B4�>yʚ&o(PW��D-d�Zun����g�����ʈ�]���]�\�=|]�B��k �Ur�����QPw��R��8�      �      x��\ˮ$�]�|E~��~��E��@�l���L'�{~$��>�"%QU�I��u=��J��C��/!>�l���⎘|�?́����݇��×׷��+��_�����R���6�ӆ�����v Б���=jI�>%*��Hg�,�EA���sİ�w��G������z�:��r���IG���9J�;je@��}#�x�X4�5封��b��kc�TCc����q�l���r��8Br�S�=rP������xW���#��������bbs
����X�f�O\�c�܀�P�j�1ʌ�������Ӡ�b��)5C�����_������+52���̇MI�8�퓎4���t����VP7�xV�������0b=�UX?�XKsY�l���.�#jp�`��rgl_��_��Bi�\�[Guk����Ѽ�Q������������):�����>���(���Msum����~�h�� �`yr�GW�=MȄ:���#;�q�[b�=�*_y*&�3.�t$��W
Fn��MrG�
im$�P�N�|Sl��6ÇP��Ђ2X��l'@�+�
�6u�d��γg�#��g�D�/su�߾���_�����η'�XYc�	����ʑ�'�7�E���1�r�(�G˸2����M�p��5�axv̛�C0��k��J�����(��O%�k�3�f�껻	Qq(_��]q�X���)~�ޜ)�ӄN�o+ƘO,p.5�3/;�T"JP,��c�1I!�b���+_tR�`=���q
�`��g�v_�:#38�ug
�K���9ꅙ1��DSl�J��+��0�
uV��K2�7�e!�EXk�)d�m[bl��f�3I�����o��%�Ϛ$:��s�x&�!Zq>��g���U���CAi��vl/�Tc槱�'��@.��y܉%ޯ7�B�m�]�f�R_�������/O/� �@s]L:\&��擨Sl2�h�%�8C*x]M SX*�X�y���@���!ݻ0��H���"�0A?�DH���_�%ox��:�T~�)X��gAl���f�B�E6F��X�����t^������8~�ZH�+|��#*����jn3?,�8o,�6"1Bh�hM͑s:xhE1%O�H1�ڜ7E��S�6�d8(#I���X�� ͞�!��CaǝL�A�)�Z�2{ҁ�
O;���Ja=|5�.�^.A�Cl3<�E�|����ן���Ё��If�V��uRI�~B���Lf����Cl�X���vK2��B��0+�P!�ȷ4�P�٬�Ҋ+��$/8	��4�rb�#d5?ax��g�:���AN�	0�d�ꭾ�ve�4	�L��^��H�E�'�x1 u&CV��;Dg����
���QSwd�E���,�
V� �"�8��0D\9=g��T�Yw�
��4���;��e�G��vE2�\6��OG�;*��ք�Dq@گ7��K^}�w�e��>���ylcv�"~�ٚ�@�g6�dP��=�YL-ݲ}�$>��{R(�����F�JywĤ8t�]Hk
�j��-ZD����I��o<�](�j�T0�ɑգ����lsU�ڎ��$)���U�A)ۂ#���9K���e�ja��b�����aKψU�i)���D���!���i�F/'絏���4e��5�En���W�`�I���.ٓ�/�7�fQ��`r�J��$,�KA�ʷ�x�mx(!�L�F��ރ8���z���y�*�a�}��J[e����mγ� M�<=��§�4Yό��W��=�*��ڳ��%��)������ȓ9X�`d�w3v�]���YYV�%d�+���n��$����B�����rtQo�fXO��KM1��e��ut�ސ��] �r��G��c��;ұg���T�1�"~�.����0�=&\R�'C��K
�l8�E�.W�&w�~���+�Z��p$ǓF�%�%d�.O�/�.�ß^o���|����DkG�*�|4v:�l=l��w���J<8:hM��~Ux
}Uwկ��6����M��[�e��8������赨�>pXa���a3;���|)g��੼�y���y_��\�XC1,a7����uh��>�A^��+�N�N�n �v�/ ���!����u���
��K��9@Vἂv7Wh�h:r���g^
^fb��a��J`*�HR9A� �&�g���*0|?��*���#AV6�ݿ!+˰a٬����3%RN��wk5[%�g����b̬�G��%dqqYސl����J��%}�2KSy�K=\L<I��m�����R*)�ޞyY����1.��נЛc/��,���i`q�z{��"�[ξ��$TV�S.��6&�_��#��.��o�H��Ԫ�"c�`��H!�0��6`����#�7�o����k�Z�d*��ț�`� 탁.?�{9:qb5��E��N�M��m��X6=r>�sĬ	����A��ߛ7�F�mv!�\�/1�<w���@s��U7�cd�(���;��l�7`v�ևLZwR�0�ǥc�I�tH�=�G�v�@Z����:���ܠ����~�*�r�*�ep�;Pl�n�Y�}�lր��Jv�<�b'X<�y��p#�+W��R�h�8T�T�ޖ��,y�	}ܐj���2:J.�Bw����}e���P:��r���2�a�7
���\�_�A�z둍]e�C��Ej�gp4��Ƌ��ʿ�����^�~���~�o�"`��A9L�d��6DH�\ǩq`��vĚ蛓��9�P�i��>��qnXI��p$F&ɹw@��mhu=���Ͷ{ �Nќ��}��������>��l���~��s���c�@�^�s�±� l�^;�%�ʎ���y�Qr5֖��5�O��H~O�5���V��yu*�
z�E(����,�C�LEԨXN]~%��F@��+�M���߯�>���(�vT���'�G�3�{ziC?�}zY��%��)�6T.ZN���`]�m7A��@���M�Rl�	h�~���`%��@��ߘk?�f�6x�uE�6,���Bm�`�(�ۖ�@�E�`i)X]�$�'�\z
V�;M�N��T`���[C��X�
4Ý�A�멭���x�bD��' L��;<���b����������A��۽�G��̤�:�R,��J�Y���%K��R�IU�(�Q^q!A8s�۹�%	�dܓd�T�6+G�z�e������14K�-��3/5�{�8���Dil4X�JS�`y�M�BYgS�f���W�LMi���"�$O�1I�N��N݊�x�'�6b� �'��,ٓ�_I�b,g"D�|.&�i�$��L�c%!5�Hl���`����f�A��<�@��9)V5B�L����DEh3���d�V{5|:��\�z�9z+�%E���lA��j{�D(�j��􋻜'ˬT$h�/4P缃�����#�ގI�,א�^Y��x�i�9F�bI�+��,S[At��mk����F�={�P�i����|u������Q�69m��]�y��-$���+�EW����:'�j�����rD�7z����]�5x|J:~�'��*�^����Gm����z�BT���Bb'�x�3T7e0�$�N��s�Abg%w�2������jG��f=]�D鳝���F�-�C4"Q����c[M�HI;M�����ع+�Gʲ���.�b�CN��zt
��PuU]l�E�RǇ�wY'�uͰ�eќ��k�h����/m��ӕ��V�1�_oC�q�H3� �;�0�#`B�ׄ��������/�#9o��<��{E������rL+�)��*�	X�2̷���w:�*r'S5�f	b�bص,�Њ:�a���;~�7�E^aF0ix[@~Q��Y1��ōW�`k�Pm�yL��؈:~_7��P�>D�=)!��m�3�o)�����:�=�U�jmG�&O5���?�p�e�X{<�B�9�1�D�2��OͰ9����ǵó ]  3|e/FCK�kxd3v��N�1�g)�̋IzFE�[�r)��t�;�O��QyR~����{�ѱ���H�����^n|`;rH�'���v��+�螛?��&<��^��M�~�Y!Y}����M�7h鵜2�]�)v��䏟?�����몍�ؘ�->�
T-p}b˟Lr?Y^CG�y���eE�^D��M8���:�DK�B��$���n�&+��V���� �� �H��|{���C���Zf����U�"'u��t�fP��7	F�&��(����� � c>�~u����ΰ? �ŵ]9�3c����R\OjɁz|&�������o=o���~c��|͆�lC�v���HŚ�R��g��`����&��c��.�8� &zR蜍����h�.�Z(�N���d�4՝\g�C �c�����J
g�[[����j9�Yw��}��L�`���V�7�3z_�z�|��V@�z��r锝���C~��w��6?����������/��c\��i`���8$>�^b+���x*�JzP�M4\�,��	��+eY<<&��Uw�_��ނ�Ԡli����ɓ)���üѯbL����ro��<D!��'<�"O�7OP�zS�Uq�Μ�{�M�+B�yӢ��zw���<����˺��0���U�!�VFQp�[Z�����&D
��@���鄾v�{=����x�{D���A��R���w�l�x�'��g|B�Oӳ���W׳:������^�U�;z����t��ݥa�a�z�O"#�|�б�0B����/v�b���VT:z����.4z�|����v�_O]���������r      �      x���ɒ/����y��8i!��u��0c˦�s�f�jk�O��Fw�'�s�y:o��
>��W����y��7����������?:���W2�7�������?���?�������E��k^ׄ�}-��<�!��J��
���C�����vF��_&G��;���\�������s~�����/�ݿ��_��?����?��_��ʆ���k\*O�S���e�oV�`�m�E$�����'}#��3���n#Dzߔ�ȕ����{����+��f$�mL}c��LD$p<�O���Q�-B1Ѐ?U>���e���yd��O}���DS��?�{+�f���n ��٦LȾ���
B�2����	4/L0�^S?�wO�YҗI4U�Q0���I�-B�Nɔǡ/����D�q������k�`O�YA���i���"��&�o��2��vO��@�T�eB�|�W��oC��1��+ɯah-��B�����Y��o�ا�*��QK�V��Ola|�UQЛ��'G���	(��; ����:�hݵ�����0�+�o��Kë�>]���-\���v��W�B�
��N۔2��ԉ��7��JH4�庤1����ml"�S����#�2���y5��+ї�g5�������l�<B��j3=�����g�� �c\��N�N�4�\��GW����֩����_�|���hJ����5�D��qzk���������?���_�;�a��ٖ5M;t�?ԥyo�[ ��=��"E32��*��OH'�����bW�� ���#��	������yx����&[ŭ�e0������}~g����� ���������!�>m��o����n!��}��ӿ4�o�2�Q����SHB<���|����I�- ��S���pʧ�B��G��ǚx����9�!8�3�aڥ������S�"6�wٌi���w��&��E��������?9ێs�s�._>Ԇ���)G�E�u�g��i�E���<W3͆hֿzzZ:�ʔ愵�0$��6Q�����2��V*M�)jyn缉�`}uMk"��˿�~��t���m��[Z�'���pMaG�j}W�,=��e}�)#n#/�(��Wt�wY%�i�4m��"t��2��;>B:|�K�I�X�hbmkkR��o^P���C���C�$���������?��/�����q��*���+Z�U���+J�U���+R�Մ��$�i�iG��]�h���^�P�f�U^�P:�fܕ^�PZ�¸����]����h�Q�}�����n���+!U���_��گ���_	���F\`���B�T`�*M���%X2����j�D(=X3���dHMX#������.�4�B���S��&�'���.��w��I��DM���������?������U���J�X�g������Ii��4?���m��~����|�z����6]R��:x$�|}oK����
'�7v =V��֥��Ť�tҟ���#�-��Pu��e3� �O�4uv�_�/R͟z����/�M���\��_<���:�����~�-����@�T�f�/�JW=M���6����6�{�B��@��x�F�j��%\Ѡ�<�M��e a[��\��zAa��� i4�u����Ü�8���õcT#hN���z_2쟷�f4�^�oִ�f�&��G�̕��G��X����jQ�*��GK�=�Z������?��u9wA����q)OI����eOQ����e	[!ۖ�Y�o�w
���N�.l�;7��h�u�w����Ҵ���<������Y��t��dX9`�h�QI�0'ϡ�!v��s�X!R��^���b}��(}��,-��I��������@��t��?�����:OL�tȩ�����������
��)/�Kʉ9E���ʉ9D�g˔Ug��O�.�Ε.l�\z^�~�\*gY�YV�J�7�'7&�_�=9)D��#�[XVҦ<iJ�/Z�����8�U1jb��o����y�}��.B�]��]��d�Ƥ�<��d�$%I�v���#�8�Ç���Д}i�g�K?�)�D6�c��#���,m����}}N-� ��e����Tކ*{�����2��6��j�_m�P�~;A��O�M���XT*�U��U[�5�-�j����y{�UH���Wyl}������h�����}�4Pa�،�U���� ��pV���)�Z�PRVѬn�"0�_���W=��6�Ї��`4kG@�KrA�S��O�\��ǨxV�ql�q!ױ�g5Wˊ�N���~�h5��J8y�h�͏�h�0�F��3��o#�V������MW�uH���V �#z�%0��p%�''���!��D��؃A�z�m��ygN�N����,�l��5�-�@jl�N
:��7���&����
u�wE/Zt�Y�x��#pЩͭX&�ļE;>۴��Z^�-ۗ��V�	�����-�(��o_���#0�P����R�]9�
�4�����n�㇢����}��S�e�'x�Z2��t����q]o4wb@$��������{�m�D8TROU���v�B{:)��Jd�<�Z�t�;S�D���ԣ%A�"�Ƴ�T���YXmo�˱��UD{���.^W���N������yC[�{J���qm_eN�V^x�[��I�w7�yi��-��˨�(������<���Y=�My�mS1����ybסes����uM�b>�s��̗����q&[�#b�ؤ����A�i&~�S4�&aٹb���M-���r�Cpm�r�1ONӎ�����0��O�N�2���tl9 X�=���E��r���ك։}jӱ�E�Ϙ=x���O:���>m��sB�ϩT�`D4 6"�jG�#�jJ0%:�51Ț��A1���6�@ �b0�f�` ��#>X,������h\H�;�����ĘdbL��ʘde�CcR��1(l�IA�F�|07&����dq���dtt�g�[��\�u�^gy�H�sY>� ���7uW%;���?�ȱA�<!b<��>��gՎV&-ܐ~�ӏ����8W�C�l��&��Y��胃��.d�KO�2϶$�5�-���<��3���z�fOP�{<4i9��KUv+V��;��h���T�7�,G'Uώ�pT5>�&�zV8�&�zX8���i5贚��q5 ����`��jB�ր�k0>�X�N��=���xd)��̚�Y���Кth	��ԚtjṀckbб51έ�A��̑�\�����w?�&�\2W�vtM
:��Ֆ��lR��lf=��f��f��yP>���j$3xKg�|:���/ĔP�E��%�����QŔ����UW2�G�m����Ń;�N�!����߶CŧN�@���0�0�N3���[D�7��f!��D5(�d�y��K�2�)O���!s���+��}�s9�6�<�Y����#(�O<ImL-���R�.����^�g�>+v��̔M��s�T���'�	���Ng%$���$�v���7��-s��g�� ��ua��!�[��O��`�����e����dJ�K��ף�B\��u|�VU�wD	yy�\�'�5���7�kIM��ydm�|���L��;�{�7��%.@�'���Nq^q�����+�"ݼ-j9}]=�u%�}@ы�#���}����
tڄ|B��i}�\�)֛���L_������L&�ħ�����"`�M�㨟r�hj��;�Je�;r�b��7�}5��8.�G�UFS�{�uzw�݊q�ٓ�&�d�'�d�9=�0�D�0�`\c<�c<r�8�.%�3Fܢ;Ѣ;��s��l�YRph����\O��+ͯ�	t�_���b���`���-����\��h@�:�h@��/������ՠ6�ɏ�8R#g� !��b��W����]8!4e]X�=�_�Z��#�)�y�9����/�싋E>��	f|]��ąL�LBh�ó�A�Ir�J|���:u�F_v�	It,�O�b]��    �Ͱ\8Ưs����z��]5=���逃��#Ύ�G ��&B��O�dA@~�F��i�@@7Mg\�4����
��9i�p��q����D>����h�|�i�r<4��<4ͮO1����C�����A��g�g:���锛sF-��A���Q�}3rw�ȸ=� όz��o���1#�0t�4��/#�/��斑��2�m�^�^�6w��` �LG\|2r@�OΑ�KF@�K���GF@�G�ߋC�JHuȠ�9���4�����o-�$�A#�3\��98ͥ*��n_7��1���	S�#}rR%�����@̤&�ק���Tj� �1������TcȬ��s���z{�!pl�,\�b�U�@��Q<ݲ.E��3MHopN��(�!�0Hw�+]��樬¸m�٫j���.�Q�UV���$ViX�WK֢h�,VqX�#<����EQ+i�ҠH�/�~�E-�H�:$t�>nU%�VFd��SX���2��0W��S!:'�m��|�u�.���U����Ռ������:�C��"�L[�ב��xF���Lk�����ӹ����aN�#;��_�c���oh^��ʣL-M�@��d�x6�U�iMZ���i�s:����5��١ֳ��u�i�����j3gL2��<K�*��>�pڒ^1��i���RI�-	��Ay�d�^�)�5%��*�,<�å�SL[��\r��?�63ҥO�6�%W5����*c&��g�d����&�|��y���y'�߬,�D�ꂽpv�_z�m\�i�n��s`�i��O��	�::�'T� :�N]�NB�t2Mqp2M��4�����o�� �j���$ �j$v^��	@���.��X� T�	8kY ����wS�&*Z#���zh�#:���a�)^1��iDgb�G`Z]�o��:�d��}�u>h�"�G��!�W]�}KpaBl�#��لz�q���C+�0!\��iT��]
u���E��+N34Ù�m��86��y����A>����m@��k]��1!4MO+���r�(�Y'>�ׁ��dE�$����,��Uv.��|���G�q6�Ъ�Ms$5�w�.�vM)~�6�<�6�oN �7�qN�8�sN�9g��e��u�D���9`����9	`�9H��U͍r�&C�5 &�h�ϲU|��!�V�*~Nviu��ޔș���=� 8{�>Uq.���C�D�CE���P��S�b~����NU����n�VW�� �^���f%�n�
2���`�+��`�K�+|`��8w3|p��0w;|`�.9�9�!��n��$K\r>�ⓃLq	���mq	����qŹZ㓃�q�D���!s\����!{\����|K9�X�-�5�f�����[^��&�$`�� -3�l�E�	��9�v�=5��Z�5;�rfN��xs
r�������Z��k2�ɵ@�'ׄ��KAn� �s���ΉZ���4�IA���ܴω��B9k��4P��y��'��
t5���C��ݭyAB��O�/�Qa�L�Z��$���	�a!r8S��Q�����i����E�sI�*cH��"H�;�홄yC� 5V�g<�y�����x^���f�Ii�%#�=K�vq��Mpʣ��7�	@��^	�OR�⬲OP�᦮OP�;᮪OR�㪦OP�⪢OR�Guɫz.fT�墚
P�G�JR^MU��Iuq�?�ʗ1\���Ӑ U��8/K@^N�d�!`���*<!� k+zyXk'��������zQy�8Z�R���y���� X�p]铀V�@�W�D��>��>	`�w�}�OZ�q]�V�@\W�D�����.f\�rY�Vzg�p�@��p�c��ln5i�g9��U3���SFz��?�Zw�V����r;%r�Hx��4�S.W��N�)}L��ȇ>��]C�Л�5�k �}.y]���=����5 ��s�o�]����pI� �=��7��$`�yOK&%��qxl۬����9�="N�t)״�p�uNOE�ꐥ�2=z��b[�&f�,MG�����we���Ye�)�fi��NL5�6��@��=I6c�[�A���T�`K��oe���ȣ8�&kQVݪ��  ��lUͭZ�`��/4��jn��2 �����zޢ�V/q�!�`[�� �o�v Wz������V)���C�"�j��Q{A�ޡT���KI ���E��cj��V)j�>��&H�l���U/q ʡ�dz�Rv����ސ�k .e���H��������l�Ѐ�Ʋy�[��ρ�:�zK��*��9� z	��Zv�֪�C"�n~��n�;Y���y���t٭z50]�8�9�KѭZGAp"vЧ��nՂF�q�C�$WJQȪ[����FD��-m�:��7sP����*M!�ˉjn�{�h��ϩ-c�����~Nɜ=uN-��9�ꬽ��� �sJ���< �8�5�}Lf�|$� �U!�{�2u��E�Y^��@X��Wӳ�X�d��X��ײ���_�SyU����ٻ��X��h?��̧-������y�[��׃l�w5TV(��� �a��gJ�'��W��ƙͩ�/*u�YW�L�j�?:u��x ����V'�r#��B��2��DRy{��ň�T'QW�����boc��+�I{F��B9��v�l��HF�m�]x�4?dU�)?Ԕ�INj�8;>�T9�G�Ax{=&  �T]���A��6 ㈯#�u��n�x��`��p6�a1�����s��z��>�wi@��N�����xT)A�i0����ネ4������H�c���n�`%H�����`&͉��I?������Y����i��Ĭ�ҏ:�KI~�b)�F�s3��K��ҏ��v[ib|k�
(���	ٌ��tl����,��Oz�vsiBs�'][���^(���r7��.���"��b���b�I��n2M�b2��{k��&d��~�SU���S��ֽ�ۋՔr	���O�>H�zJ'���3��bp��� ��2> g{���E���%{@N�(��o��<�ԇ�HO�o:�j��\�Mi�LF��*��ϊE�]�HH��TL�Ŗ��7�b��
Ŕ?[���_�X)2a�˯&�|���j��b���;�A���딿X��ﯖ� \�V����:�/6�����* δ��\"�E�J�V��2��� t68��L��U-N�S�OFΘX�q���|K:���y���`���!0�p���mv���7�ZWSx6�Y 8�NVf`�J ���Z�IP�[h}��	4!�PR�x	4+ %�D>�9�erO�Y�q�L����Я�3`!���ĉ"9o��h&ʋЧ�����n*��u�g�Ҥ��:o�zs��&���S��2�L�E�K>Fk�9F+�U��O' �����n�b�}��$пK�i�?u������>8�e�C3��I.	D��`7Χ����j�����G�[�G���qڛ?��{{���U▋$Z�ٸwx��5����wq��5�����w-ֽ��>�E�qV^j�{�N�V��mH1�͓��JBwN��tɢI��(������x���R���8�K \���ӄ���Ҵ��/���nj�as��w+�IHsy/�>ɰX�Qa�h��j��_�A�H�n�- �C�A�w�=)���ey�mj�V����8�*�{�֪ŉ��K$���e���+���,.��k�������e��^�Qp}7k��:�6���?0@�9���ړ�^"B`�;K
�n{� ���lx_ݚ!�V'�^�gK�hrR���{-B��}�Ӛ;��"�\��U�7L�3�(�>��9Q����I�yq���3ə �I�)�*��������&5}.`�,�z�Q|O�@��kҗ@��ܤ�&!�PX4rH�}��5	1�d���u�I���I�x3S�ܓ8 �&}�%ȧ:�4��	\��˫��;�4@9�&N)���+�4�$�\���9ݟ�m�I��I���U�\��]��me��T����)�5��L�&{��\����kY5���&    !�&Sr����'�5	!�5��_eUϖ�\���9`����q�N�VM�˫��Q�P��o�aȒ"�^d�4YUDk:� $�:G�)X]V��� �D�ww���H���D�=|���H�!@�]M
�&��"�|`����Ejf�$�W{�W�EjB�T��7�.-R����CS�oUX�f{A`�]W��{�*R����^�D�.ߋݬ�H���.}]�2�`��哜{��+�z"�F���GP������JLk;'��S������S�����\�Y�;��`Q�nQ�L��I50�I�Bn6Հl6��܍�Aٌ*M�[U��YU�bV�bVm��]5��jW��|7�&e3��e51�e����nZM�jZ�$��V�u���?W�{��|��&g��~��1̫��̫�~t�jr6��'���z�*V����$TK��na�$�c�X�cZ��|��&e��~��э��Y���$�t+kRV+� ��R��{�����	-R>Z��Z?H��Ĭ���@��5)����4�"=��bk�4���p4�؛,oyu��orQ@:aW@�nnƦ��̋�/R6_���f�{�����z6.��I��r�Rh���W��N��aF'�xn���}��S7�_|���Wz���G�+����8��ȇO!/(4�e��҈k��_<�Zs42?ױ��������C�W
BY�ɬ����'�G>���y1�Qt�g�����)�G��:���\Q-�2�0�Pk��D�45�&��!	��ON��Z��N+��5���f0�f2�e_� ��寛� 쑽A8�$�Pm�
W�� t��0��[S
��p��� ���>�˒FJˆ�9-��1��[N��I-���@�I-+g��P3�!��� i-�XzB=-�e%�Ė���z�Nj�-����u�^��=�e%��!:�Q<.-�-���,}�Pv�F\f��O�xT��r~eK�	|&	y[\�a��|�z9E´,5.r�%�������-����yH{BAxS�7��J��.� ɷYHzdշ��Kj<���n ��7��N�!����˯+�"��T/����j;�
�V��}I��|l�w�����[#nGD��J%���������6�i鹄�z��_: ��N�=�H[���W�xy�����;���֪�>�}ۮ�pW�G�.���B���^�餑���|yBl��)<������G����*W�q���ؗ�ȧ9��&�/T�]�r�����7�ޔ_=z"�(�uaq2��ߣ�^ȓz�J:? ��K����m�IY���YS�������Cfk*�q1��"�V���\,CK���	���0Ƀd,�8=��%cy��������
�4hz1l!6��l`���'��ک[�͔�<���v��}���mf��V���w�	�n7����O=la������'��Q���n�N�4�YU���vG�޶���ћ�n�Ck[^�V�F�m���m�z�A �pRAjl�J�g5���0�����>�^1Fc[ �mm��Ht
b�'q�����e�6���9���MW͏��6쐃�8�啌��vc`6���췂1z���і�|�~���vc��j�JF�h�!�lSm%��6ΰ$Y�[����hA.���/Ua1Y��i[��}��G�Ż�J̀�[��)I��7L�d�H�ZuI
c9�v���9(��;d�wRh�����T�&�~pؕ�Ώrڭ!�d��uleO0��˷�侍lF1j�_8��|,�j�Q���0��}&:��r�*��K�[�"�,o�G��#5�<>��V���AM	lb[�U�1Z+�6I�3�u;���68aPφ�I*KL��C��`�jG������3kbKs�ތ�@��ڊ�ng2�s�A�w��,��1�����^����+�W	�Vԉj���Z�Eb\�:��s/_nW���끃Ԓ�ᗖ&���	k�&�6�\t��Z�g(ۛH��[�=F��{Z�0�*q.NV{�� �A �*�Tʼ��5����S�H�՛��)WΞv�b����&}8��2$����]�<Y��x�q3�d%������'+��v^G�M=Y�Xzr5�d���댻�����ހ\>Y�d��:�n��2$��7���F�.C��|s1�t������ː�v��\M?U�X~s7�T`�����eHv�o�^@]�d��F>��\ʐl��ʼ��
	�;��	�E��eHz1������޲��V� U���<;T�Z��;T!��WuHz�$��%2O;�t!�Vf�@��9p��ѕHj)�ɯ�I�~E���[3`�|�v~:�D
,8�&�z�������)&R`�Sl0>c"c�r?�D�~�ȇ�Ld���lR�'�Ȁ�O��p����(됏g�H�Eg���3��f��4�Y��4��q&�`�q69�3�γ��p��L��@�'�ʄ�O���p��D��H������`�3m`�M���6���TI���908�;pVƫ����}��y�!r�T�Қ�~��9�!��j�5=C`�}Hlh/��-Sc`�|�������{��֧�����ᭈXStl�π'0��Ү^�Ae����� �ʉLa.G�R`k\/n��/�}2�6��>a@p���9<]nqRR&�ݠ
�z�]���s�k��,H���N�`/I���A4=��e�qe�v3's�W�Hӳ�IGV|���zu�I�|��~�����:�x�[�Z�֣[�,C���yA�%<%Q�F��sb;ٍ�=n�1i�9d=s~��I�����`�򚇄����d���y�����L.%N
�-ɮ�#�|Bns|B������4���0��r�q�1�I�8&�8���`��N0ZtCp�b���<o�㳣�8���e�¦	O4��u	Z6�a�M=lKV�i׮��2�&�K�=�D��`|ݸ���l�F�)��$(4���L8RH���\��N�I�JA��a5?dZZj�&�(��&�c��ۤ�mGr��g1��i�ƶ|N:Ɲ�.T��'�Yru��⒆�ns�H�%�rʷ�O�gץ�O�o�� �ot�n�6��!޳�.n;Í`1��E���E�qs"Lt"4�݇0؇�!W@B�fv� L� t�Ձ0!Ё�;�]����.��} !�}��4��=�iEY ��<�<���@al�W17�A��:蘻�@`�� κ�A�����z�
��܋�@P�۠'�^���rs�Oݜ���>��5�~���@m��e�_��1�� �Ag\��x���NR�� /ƛ�@�/wA��Wo��To�{��Xc����5ir��' ��Iģh��z���pT�������x�kp�Ê�1��ZR��y����T��|��iu5��sZ>�kZB����p����-���}�=Xu�F9����9�Ӵڍ]�5���]�v4ɖ`{�����]�XF����C�yX	p�j�8\D5/�8����ҍq�k�bm�e���ZKS�M�A��V-"�;���eqOB*�{�#�����rWyr�d��8�'(	m�լ��U9�8��S�7�@:��z9s�T��y����`���>����p�1�싼�#��>��� �����j���P{��p[؆4	�ÅW�R�����$(�%W.�N���	��,W�q��6��tpz�9rR����;�>���s��C�P�Ezayo�
�?za���Ԑ��2xo$S�7�V댌K:��x����I�(�m=���Í�p����FU��U�6�;Op���d�O2�h�4Ź�k���5��p�M>�>�S���ݙ��%ٜ<�`{
�3�{�P��)����T�7���ޥ��94[w���o�Gw�3�}w%CT�Ƨ�G<q`���B�.8��H<q`�D�K�X��B�g(��b��˃S��z�~��HJB����gH�|ƫYM�}M�p�4��8.�	-�����x�|������=��>�vc���,wU�E/�}?��V/1��p@��ֈ	2�ô���    4ԅ�7�B��gي#I�L8Yi�.2���a�*��j�`���<�<��e&��idu�Z,B>�M�::�����#����\M0Y	�`�r4ì*�T�,a��Sőj�'H�%�\�,��H�����Z.�+��K#�ZXs(Cم�ui�V�bp�H�����K#���d���H5c��L[SF$Bxs>�i"ed�4胡&RF���������-5I�h���d�I�G[�Y�5�2���v�֒��Ygw�i�����M�eEY8��EZ��8#n����-�����m�w���8�SpB�)8�H�� �_������FP8��J�]��e����[A@��ҺF�Y]���]������I��'��3
�\?NG��3��gB��#)ǭ����8���LH�t<Ĝ��Ŕ�%���"Ҥ=��94C{�NQpF34�9tDk����G�6[<�c��:�f��4Y� ��b0�jgLVg;�jgL�f;��Z���lc\uY� ]�a��l��v�U������/|�'L�'�U��R��|�ӊ���k�<�� �10��/E�ƴ��">�R�I@l��  �ׅ���j����
��Fo�fx����ΈX�=9��yٶ_I�ÙI���7ɧ�ǝ'�߷I�s�&����z�4�R����3)~hh�\�;S������a&��S�� �R6-�0�Eg�+G��>M��)i�����c�i�EƳ2k�����Y�0ee[/=L��"Y�0�bu���7��Œ	�r����UA��Z�L� �L����HkJz�# �'�BJ�ٲm1oK�E�Z\�C�y9n�#
6W^�Ԣ����)/	&$��҉���^�\Ko���=�!�lO�?9׳�� �2Ǽ�%�r�c��z��<�%V�%����$�������lJ���xG)Z�Q,�']pB\+��(�{|��0~�DAX�_�		�
b�R(��yv�LFl�P WAqtZ�v>�AAX �q��	#��'j���gg��i�O L�6JEϞ��`�p܃Cb[����%��]t��x[���؃$Uv~��r+A�����|[�͉[����ڻ�e�O�m�7��*���*���
��u�7��������ʞ�mew�˪���{��EWOs���]:���<�|δ��5��ޒ�9�-X�۾>�4�J���=�n���<�xz&>��������<�:� �4�����2�u�-�P�;� ����}�e�F�y-	�~-��	d��:8���>�_R�i� osi8N@nyُ���u����%@�]qG	k/%�݈)���:��� Ps�l�̞>Aȥ�� �Y�r����\oc{��6�7t�=�q�HU?�e'�T�sX��.�LU;�u7��v�:��������q�RuC���uS�V�u[���}u�Qg��u�_5�����>z�����ϡw��!0�H�/5M1������E���jb�Q*A@X��֡W�eqn�r�����Mg}/��S��s��b�b;k��xN�b�6����z~����z�A���Y�������0_��������u��ڒ W�{�q�C{�vn�!�͏��������'���rH�'����~ş�^Jl������am$�
nuX�& �bAq�PC���I%r�}���4����ٷ�Ʊ��W��߭ Z t�T����oMI��*��NF��	|�����T˸.6R.%t�[4F�l}��D�O��l^�Ņ���9�\�s��ُӛK�4�>�}ޤ���#�wE�J���)�՜��ߵ�	ؔ�*~�q�8Pq��L���4��+hʯ��&~�n���M��t�	h�M��T����ޱ��N�s���p|cy��W~c-$7	|3���mcp�ze�u�D�� �ʎH�b6���Ѯ.�V�O�v-���b]�Ud6�5����{�wٺ�_ii���B�����>��*}��~�'��~?��sHq�oR)�S��+�Hi�/Qiip⻙N�xh�U�ޠG-���*NU��d���s]�	�~^�4QQXâU���,�W��iħ�8���`�� ���1o/�qxXa�V���k� �؉5\���˔ .�B�!��zŔd׺m&۱6yh�HB�)~���ڠ�xB�(9u�(�����t��ǩ�����T����hY��'���&AvO��;���C�
�-��G��К/�e"�^�3��B�$���J
@`E��ul�b**��c>dE=rL����G����&�+, �cW!zW��1bW�cW!�R	m2z�
#@�*$N�~��+��������,3v�!袏�<�$!=vu`�K>�V��d��Ձ.�4��sƮ��A���Ց��L�� \ՙ	�ԙ8$�pO���V{
�<�:!�R��h����)�Ip_���m���i� iiGכI��!�9��=���(�O-3�>Xj��\��	w,>   ��.�r��ru��p�{��.=K�~�����Z�#p_M�z�j:�a�����R\5n�}97¡�h���T���tG�v��f^P�A}�S�MW�O�\������n�C�Wn�S���ƭ+��͉��W�4������%��-MNs�b�`+ޜ�+��T���Hw��DYCQ�c��|7��_�Y���V1��Э����z5&֚�]Z{g�ք�Y�X���bN���ڜX�fO����=�9�/�(Y�+�fQ����E���/&�(Y��?q��*�I�,l!��;�Q���?}��f�^��]������z�)wA^��:���Z��u}�ߘ@��-����G78Nt'%r����z�SQcJDu�^m��CT �ߨQ��n��^�Q;��\E��v��lk}�h~�� ���	荊���*�}�0*Т�;\u��5�>Cq�rd3�����O�N�2���T �s�d!�6�V����#�����������#YI~A�^�qCಏ�_;���e7.��z��$"���+�{����G=D��W.��
b0��z�Ǎ �<���[� �^�q%��1rlث��ԛ���;&�	S�{�<�\�1[W&�D�^�!�ʎ���%�m�a/�H��-�� �Z�q���4�eo� ߋ:nX�1��j����#@�j��̍�05��sܾ(,�#g��&�Z�� �8�H[PR[�[���F�E�\]�'��*��Ԇ�,}lMX��k8n�"Qv1���-� -��G�=� �5$�?Jǫ�����dI;��WeZS�����tU��y��E�!|�fH��kJ��,I<S�m�-%��u������dY��3�|i�y�}H)��m9��y�,��We��������2R�oC��sl�6����u��-�㗚��K)��M���Tm6��}z� �ח)B�-'=�7�D��[`�����Y B۲ o�)��M�ضML@'@Z�f�{7B�s�t&�^0r?B���9�GΪ�e�~&sb��������5�>XqL�m�:��PA�\����Ag[S.��z�%����ו ���:���o�b@�����F�]����>Ka�	�]���Ͷ^)�?)�k�������6N=K�8�`��Y��/?�}�I )мq�GZQL�MZ��آ܋�Sf5�P�߅'�̈́��r�i��xn��Í���;!в,Yނ�[Ā-<��r���� ���O�������&4ҩ�'$���{eD�:��Ar�t� �gGt)�s������{��ٗ����u�@�bPe�s���o� �
qRa\�j��
#��T�.��0��L���(�E���E�� �}G/eyiN��s�3 ����d����#pmQ�rm�G JZ;�1�u\!3�ǈ��( �����U+��XJ�q���
B�D!�g����UO+"
0��q�POL��B�(p4��W%=� #��2t�z�D����	��ϙO���тd�Bt��a��d��-��v�^�����CxY��{so�%�~�s��)�����A? ��_�T�o~qSn	�# 4  >#��!��ېK��O�e̥����ٖ��o!���f��-����\#�\G�o�qǎn^�@>6W?Gnl��,YE1y�Dy7Z���ޤG.��?�D�p5�LS���u)]�i�F��KBV� (��O���h0|Gg��άɪ�}Wo��f�&�J8�#D/35�4����Ԫ׵�	��L;$�����hd�=+���̔Kb-�y�I�6f�'�".N	��L;%���7���b��rwK�f�-�Q.~	��L�%6��1!�)Ǆ��wτl_�=z��]�{�vM(�߄�^�|rwN��e�9�(��y��N(�'���^����?!��i���|pP�f�A�`�
��L{(4惋B�0�.�s�Q�6f�G��Q>8)T3��P�^
��Ly)4�]̔�BA>�)d3��Д��B�1S�
�ut�T�.f�S�)wW��b�\r�U�.f�W��'�Ŭ�K=h'g�F��UV�MǑ�H����:�*E*uM��8���q_�,�R�J�!�u.!��|C�y�i��y��
�d �rTeHk�O���L])^ː"ʡ����
U��UDE�C�W8��J��<+��j�>�9^]��֊�|Q��Y�oץHk�ZH9T��4;�.�H�=u�9$��j����a���vźGZ{����w�uD[H��c���C��h�k���W��_��g-�QݰV�őD�n8���x�����"��+�n�F߯�7�W �3�Y�ʯ�b]�;������I�^]�nW�y|u,p:�Y/X��_;\`�#���V����E^�O��}��_�_��|�+��\]k,����ru+Q ��ѧ�%A6�QF���R9�r�J�WK�?��;�/�We>��;k��\
*�Q�d��?A%=j����	*�Qyd���'A%<*W��?��tG�G���/>��pu �tG�AP���@�;J���]:�Q�懼�t��v��|u�lG�5���@�;*��$\�K�����W��;Jg�@|p�|G�)����@g<j7�d�]:�Q����9��A0w��y�ށQF�������&J�5_�|�S�c�z_(���o���Z���     